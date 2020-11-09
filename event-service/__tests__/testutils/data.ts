import Event from "@src/entities/event";
import EventDate from "@src/entities/eventDate";
import Vote from "@src/entities/vote";
import Participant from "@src/entities/participant";

export const dates: EventDate[] = [
    new EventDate({
        date: Date.parse("2014-01-01"),
    }),
    new EventDate({
        date: Date.parse("2014-01-05"),
    }),
    new EventDate({
        date: Date.parse("2014-01-12"),
    }),
];

export const participants = [
    new Participant({name: "John"}),
    new Participant({name: "Julia"}),
    new Participant({name: "Paul"}),
    new Participant({name: "Daisy"}),
    new Participant({name: "Dick"})
];

export const votes: Vote[] = [
    new Vote({
        id: 1,
        event: {id: 1},
        date: dates[0],
        people: participants
    }),
    new Vote({
        id: 2,
        event: {id: 1},
        date: dates[1],
        people: [
            participants[4]
        ]
    }),
];

export const events: Event[] = [
    new Event({
        id: 1,
        name: "Jake's secret party",
        dates: dates,
        votes: votes,
        participants: participants,
        createdAt: Date.now(),
        modifiedAt: Date.now()
    }),
    new Event({
        id: 2,
        name: "Bowling night",
        dates: [],
        votes: [],
        participants: [],
        createdAt: Date.now(),
        modifiedAt: Date.now()
    }),
    new Event({
        id: 3,
        name: "Tabletop gaming",
        dates: [],
        votes: [],
        participants: [],
        createdAt: Date.now(),
        modifiedAt: Date.now()
    }),
];
