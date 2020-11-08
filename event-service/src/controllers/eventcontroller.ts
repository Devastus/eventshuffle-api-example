import { Context } from "koa";
import { getRepository } from "typeorm";
import logger from "../util/logger";
import Event from "../entities/event";
import Vote from "../entities/vote";
import EventDate from "../entities/eventdate";
import Participant from "../entities/participant";
import jsonResponse from "../util/jsonResponse";

/**
 * List all events
 */
async function listEvents(ctx: Context) {
    logger.debug("listEvents", {query: ctx.query});
    let result = await getRepository(Event)
        .createQueryBuilder("event")
        .select(["event.id", "event.name"])
        .offset(ctx.query.offset || 0)
        .limit(Math.min(ctx.query.limit, 250) || 100)
        .getMany();

    jsonResponse(ctx, 200, result);
}

/**
 * Fetch a specific event
 */
async function getEvent(ctx: Context) {
    logger.debug("getEvent", {params: ctx.params});
    let result: any = await getRepository(Event)
        .findOne(
            ctx.params.id,
            {
                select: ["id", "name"],
                relations: ["dates", "votes", "votes.date", "votes.people"]
            }
        );
    if (!result) return ctx.throw(404);

    // Format relations
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

    jsonResponse(ctx, 200, result);
}

/**
 * Fetch event dates that are suitable for all participants that have voted
 */
async function getEventResults(ctx: Context) {
    logger.debug("getEventResults", {params: ctx.params});
    let result: any = await getRepository(Event)
        .findOne(
            ctx.params.id,
            {
                select: ["name"],
                relations: ["votes", "votes.people", "votes.date", "participants"]
            }
        );
    if (!result) return ctx.throw(404);

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
}

/**
 * Create a new event
 */
async function insertEvent(ctx: Context) {
    logger.debug("insertEvent", {body: ctx.request.body});
    if (!ctx.request.body.name ||
       !ctx.request.body.dates ||
           ctx.request.body.dates.length < 1) {
        return ctx.throw(400);
    }

    const body = {
        ...ctx.request.body,
        dates: ctx.request.body.dates.map((item: any) => {
            return new EventDate({
                date: Date.parse(item)
            });
        })
    };

    let newEvent = new Event({
        ...body,
        createdAt: Date.now(),
        modifiedAt: Date.now()
    });
    delete newEvent.id;

    let result = await getRepository(Event)
        .save(newEvent);
    logger.debug("New Event created", newEvent);
    jsonResponse(ctx, 200, { id: result.id });
}

/**
 * Create a new vote
 */
async function insertVote(ctx: Context) {
    logger.debug("insertVote", {params: ctx.params, body: ctx.request.body});
    let event: any = await getRepository(Event)
        .findOne(
            ctx.params.id,
            { relations: ["participants", "votes", "votes.date", "votes.people"] }
        );
    if (!event) return ctx.throw(400);

    let body: any = ctx.request.body;
    if (!body.name || !body.votes || body.votes.length < 1) return ctx.throw(400);
    let voteDates: bigint[] = body.votes.map((vote: string) => Date.parse(vote));

    // Get a Participant by name, or create one if it doesn't exist
    let participant = event.participants.find((p: Participant) => p.name === body.name);
    if (!participant){
        participant = new Participant({name: body.name});
        event.participants.push(participant);
        logger.debug("New Participant added to event", participant);
    }

    // Update or create new Votes for each voted date
    let votesChanged: boolean = false;
    for (let voteDate of voteDates) {
        let vote = event.votes.find((v: Vote) => v.date.date === voteDate);

        // Create new Vote if one doesn't exist
        if (!vote) {
            vote = new Vote({
                event: new Event({id: parseInt(ctx.params.id, 10)}),
                date: new EventDate({date: voteDate}),
                people: [participant],
                createdAt: Date.now(),
                modifiedAt: Date.now()
            });
            event.votes.push(vote);
            votesChanged = true;
            logger.debug("New Vote created", vote);
        }
        // Modify Vote if participant isn't already included,
        else {
            if (!vote.people.find((p: Participant) => p.name === participant.name)) {
                vote.people.push(participant);
                vote.modifiedAt = Date.now();
                votesChanged = true;
                logger.debug("Existing Vote modified", vote);
            }
        }
    }

    if (votesChanged) {
        event.modifiedAt = Date.now();
        await getRepository(Event)
            .save(event);
        logger.debug("Event changes saved", {id: ctx.params.id});
    }

    await getEvent(ctx);
}

export default {
    listEvents,
    getEvent,
    getEventResults,
    insertEvent,
    insertVote
}
