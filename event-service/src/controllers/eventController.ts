import { Context } from "koa";
import { getRepository } from "typeorm";
import logger from "../util/logger";
import Event from "../entities/event";
import Vote from "../entities/vote";
import EventDate from "../entities/eventDate";
import Participant from "../entities/participant";
import jsonResponse from "../util/jsonResponse";

function formatEvent(eventData: any): any {
    if (!eventData) return undefined;
    const result = {
        id: eventData.id,
        name: eventData.name,
        dates: eventData.dates,
        votes: eventData.votes
    };

    if (result.dates.length > 0) {
        result.dates = result.dates.map((eventDate: EventDate) => eventDate.format());
    }

    if (result.votes.length > 0) {
        result.votes = result.votes.map((vote: Vote) => {
            return {
                // ...vote,
                date: vote.date.format(),
                people: vote.people.map((p: any) => p.name)
            };
        });
    }

    return result;
}

function dateStringsToEventDates(dates: string[]): EventDate[] {
    return dates.map((item: any) => {
        return new EventDate({
            date: Date.parse(item)
        });
    });
}

export default {
    /**
     * List all events
     */
    async listEvents(ctx: Context) {
        logger.debug("listEvents", {query: ctx.query});
        const result = await getRepository(Event)
        .createQueryBuilder("event")
        .select(["event.id", "event.name"])
        .offset(ctx.query.offset || 0)
        .limit(Math.min(ctx.query.limit, 250) || 100)
        .getMany();

        jsonResponse(ctx, 200, result);
    },

    /**
     * Fetch a specific event
     */
    async getEvent(ctx: Context) {
        logger.debug("getEvent", {params: ctx.params});
        let result: any = await getRepository(Event)
        .findOne(
            ctx.params.id,
            {
                select: ["id", "name"],
                relations: ["dates", "votes", "votes.date", "votes.people"]
            }
        );
        if (!result) return ctx.throw("Event not found", 404);

        result = formatEvent(result);
        jsonResponse(ctx, 200, result);
    },

    /**
     * Fetch event dates that are suitable for all participants that have voted
     */
    async getEventResults(ctx: Context) {
        logger.debug("getEventResults", {params: ctx.params});
        const result: any = await getRepository(Event)
        .findOne(
            ctx.params.id,
            {
                select: ["name"],
                relations: ["votes", "votes.people", "votes.date", "participants"]
            }
        );
        if (!result) return ctx.throw("Event not found", 404);

        // Filter and format suitable dates for _all_ participants
        if (result.votes.length < 1){
            result.suitableDates = [];
        } else {
            result.suitableDates = result.votes
            .filter((item: Vote) => item.people.length === result.participants.length)
            .map((item: Vote) => {
                return {
                    date: item.date.format(),
                    people: item.people.map((p: any) => p.name)
                };
            });
        }

        // Clean up the result
        delete result.votes;
        delete result.participants;

        jsonResponse(ctx, 200, result);
    },

    /**
     * Create a new event
     */
    async insertEvent(ctx: Context) {
        logger.debug("insertEvent", {body: ctx.request.body});
        if (!ctx.request.body.name ||
            !ctx.request.body.dates ||
            ctx.request.body.dates.length < 1) {
            return ctx.throw("Invalid request", 400);
        }

        let dates: EventDate[];
        try {
            dates = dateStringsToEventDates(ctx.request.body.dates);
        } catch(e) {
            return ctx.throw("Invalid date format", 400);
        }

        const newEvent = new Event({
            ...ctx.request.body,
            dates: dates,
            createdAt: Date.now(),
            modifiedAt: Date.now()
        });
        delete newEvent.id;

        const result = await getRepository(Event)
        .save(newEvent);
        logger.debug("New Event created", newEvent);
        jsonResponse(ctx, 200, { id: result.id });
    },

    /**
     * Create a new vote
     */
    async insertVote(ctx: Context) {
        logger.debug("insertVote", {params: ctx.params, body: ctx.request.body});
        const event: any = await getRepository(Event)
        .findOne(
            ctx.params.id,
            { relations: ["participants", "dates", "votes", "votes.date", "votes.people"] }
        );
        if (!event) return ctx.throw("Event not found", 400);

        const body: any = ctx.request.body;
        if (!body.name || !body.votes || body.votes.length < 1) {
            return ctx.throw("Invalid request", 400);
        }

        let voteDates: EventDate[];
        try {
            voteDates = dateStringsToEventDates(body.votes);
        } catch (e) {
            return ctx.throw("Invalid date format", 400);
        }

        // Get a Participant by name, or create one if it doesn't exist
        let participant = event.participants.find((p: Participant) => p.name === body.name);
        if (!participant){
            participant = new Participant({name: body.name});
            event.participants.push(participant);
            logger.debug(`New Participant '${participant.name}' voting on event '${event.id}'`);
        }

        let votesChanged = false;

        // Update or create new Votes for each voted date
        for (let i = 0; i < voteDates.length; i++) {

            const voteDate = voteDates[i];

            // Check if given date exists in Event
            if (!event.dates.find((d: EventDate) => d === voteDate)) {
                logger.warn(`Participant '${participant.name}' voted on an invalid date '${body.votes[i]}', discarding...`);
                continue;
            }

            // Create new Vote if one doesn't exist
            let vote = event.votes.find((v: Vote) => v.date === voteDate);
            if (!vote) {
                vote = new Vote({
                    event: new Event({id: parseInt(ctx.params.id, 10)}),
                    date: voteDate,
                    people: [participant],
                    createdAt: Date.now(),
                    modifiedAt: Date.now()
                });
                event.votes.push(vote);
                votesChanged = true;
                logger.debug(`New Vote created for event '${event.id}'`, vote);
            }
            // Modify Vote if participant isn't already included,
            else {
                if (!vote.people.find((p: Participant) => p.name === participant.name)) {
                    vote.people.push(participant);
                    vote.modifiedAt = Date.now();
                    votesChanged = true;
                    logger.debug(`Existing Vote '${vote.id}' modified for event '${event.id}'`, vote);
                }
            }
        }

        if (votesChanged) {
            event.modifiedAt = Date.now();
            await getRepository(Event)
            .save(event);
            logger.debug(`Event '${event.id}' changes saved`);
        }

        // Return formatted version of changed event
        const result = formatEvent(event);
        jsonResponse(ctx, 200, result);
    }
}
