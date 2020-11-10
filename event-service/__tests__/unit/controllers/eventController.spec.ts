import EventController from "@src/controllers/eventController";
import { mockContext, mockTypeORM } from "../../testutils/mock";
import { expectJsonResponse, expectErrorResponse } from "../../testutils/response";
import { configureDateFormatType } from "@src/util/dateFormat";
jest.mock("@src/util/logger");

import Event from "@src/entities/event";
import EventDate from "@src/entities/eventDate";
import Vote from "@src/entities/vote";
import Participant from "@src/entities/participant";

async function runWithMock(func: any, request: any, mockData: any) {
    mockTypeORM(mockData);
    const ctx = mockContext(request);
    await func(ctx);
    return ctx;
}

describe("EventController", () => {

    // Test data declaration
    const testParticipants = [
        new Participant({ name: "John" }),
        new Participant({ name: "Jane" }),
    ];
    const testDates = [
        new EventDate({ date: 1388534400000 }),
        new EventDate({ date: 1388880000000 }),
    ];
    const testEvents = [
        new Event({ id: 1, name: "Test event 1" }),
        new Event({ id: 2, name: "Test event 2" }),
    ];
    const testVotes = [
        new Vote({ id: 1, date: testDates[0], people: [testParticipants[0]] }),
        new Vote({ id: 2, date: testDates[1], people: testParticipants }),
    ];

    // Before test cases
    beforeAll(() => {
        const config: any = {
            dateFormatType: "isodate"
        };
        configureDateFormatType(config);
    });

    // Test cases
    it("should return a list of events on listEvents", async (done) => {
        const mockData = testEvents;
        const expectedOutput = [
            {id: 1, name: "Test event 1"},
            {id: 2, name: "Test event 2"},
        ]
        expectJsonResponse(
            await runWithMock(EventController.listEvents, undefined, mockData),
            200,
            expectedOutput
        );
        done();
    });

    it("should throw 404 if no event found in getEvent", async (done) => {
        await expectErrorResponse(
            runWithMock(EventController.getEvent, {params: {id: 1}}, undefined),
            404
        );
        done();
    });

    it("should return an event on getEvent", async (done) => {
        const mockData = {
            id: 1,
            name: "Test event",
            dates: testDates,
            votes: testVotes
        };
        const expectedOutput = {
            id: 1,
            name: "Test event",
            dates: ["2014-01-01", "2014-01-05"],
            votes: [
                {date: "2014-01-01", people: [ "John" ]},
                {date: "2014-01-05", people: [ "John", "Jane" ]},
            ]
        };
        expectJsonResponse(
            await runWithMock(EventController.getEvent, {params: {id: 1}}, mockData),
            200,
            expectedOutput
        );
        done();
    });

    it("should throw 404 if no event found in getEventResults", async (done) => {
        await expectErrorResponse(
            runWithMock(EventController.getEventResults, {params: {id: 1}}, undefined),
            404
        );
        done();
    });

    it("should return event results on getEventResults", async (done) => {
        const mockData = {
            name: "Test event",
            votes: testVotes,
            participants: testParticipants
        };
        const expectedOutput = {
            name: "Test event",
            suitableDates: [
                { date: "2014-01-05", people: [ "John", "Jane" ] }
            ]
        };
        expectJsonResponse(
            await runWithMock(EventController.getEventResults, {params: {id: 1}}, mockData),
            200,
            expectedOutput
        );
        done();
    });

    it("should throw 400 on bad request in insertEvent", async (done) => {
        const request = {
            body: {
                name: "Event",
            }
        };
        await expectErrorResponse(
            runWithMock(EventController.insertEvent, request, undefined),
            400
        );
        done();
    });

    it("should return event id on insertEvent", async (done) => {
        const mockData = {
            id: 1,
            name: "Test event",
            dates: [
                testDates[0]
            ]
        };
        const request = {
            body: {
                name: "Test event",
                dates: [
                    "2014-01-01"
                ]
            }
        }
        const expectedOutput = {
            id: 1
        };
        expectJsonResponse(
            await runWithMock(EventController.insertEvent, request, mockData),
            200,
            expectedOutput
        );
        done();
    });

    it("should throw 400 on bad request in insertVote", async (done) => {
        const request = {
            body: {
                name: "John",
            }
        };
        await expectErrorResponse(
            runWithMock(EventController.insertVote, request, undefined),
            400
        );
        done();
    });

    it("should return event on insertVote", async (done) => {
        const mockData = {
            id: 1,
            name: "Test event",
            dates: testDates,
            votes: testVotes,
            participants: testParticipants
        };
        const request = {
            body: {
                name: "John",
                votes: [
                    "2014-01-01"
                ]
            }
        }
        const expectedOutput = {
            id: 1,
            name: "Test event",
            dates: ["2014-01-01", "2014-01-05"],
            votes: [
                {date: "2014-01-01", people: [ "John" ]},
                {date: "2014-01-05", people: [ "John", "Jane" ]},
            ]
        };

        expectJsonResponse(
            await runWithMock(EventController.insertVote, request, mockData),
            200,
            expectedOutput
        );
        done();
    });
});
