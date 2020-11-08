import typeorm from "typeorm";
import request from "supertest";
import Koa from "koa";
import initConfig from "../../src/config";
import dbUtils from "../testutils/db";

const testRequests: any = {
    listEvents: {
    },
    getEvent: {
        params: {
            id: 1
        }
    },
    getEventResults: {
        params: {
            id: 1
        }
    },
    insertEvent: {
        body: {
            name: "Jake's secret party",
            dates: [
                "2014-01-01",
                "2014-01-05",
                "2014-01-12"
            ]
        }
    },
    insertVote: {
        params: {
            id: 1
        },
        body: {
            name: "Dick",
            votes: [
                "2014-01-01",
                "2014-01-05"
            ]
        }
    },
};

const expectedResponses: any = {
    listEvents: {
        events: [
            {
                id: 1,
                name: "Jake's secret party"
            },
            {
                id: 2,
                name: "Bowling night"
            },
            {
                id: 3,
                name: "Tabletop gaming"
            }
        ]
    },
    getEvent: {
        "id": 1,
        "name": "Jake's secret party",
        "dates": [
            "2014-01-01",
            "2014-01-05",
            "2014-01-12"
        ],
        "votes": [
            {
                "date": "2014-01-01",
                "people": [
                    "John",
                    "Julia",
                    "Paul",
                    "Daisy"
                ]
            }
        ]
    },
    getEventResults: {
        "id": 1,
        "name": "Jake's secret party",
        "suitableDates": [
            {
              "date": "2014-01-01",
              "people": [
                "John",
                "Julia",
                "Paul",
                "Daisy",
                "Dick"
              ]
            }
        ]
    },
    insertEvent: {
        "id": 1
    },
    insertVote: {
        "id": 1,
        "name": "Jake's secret party",
        "dates": [
            "2014-01-01",
            "2014-01-05",
            "2014-01-12"
        ],
        "votes": [
            {
              "date": "2014-01-01",
              "people": [
                "John",
                "Julia",
                "Paul",
                "Daisy",
                "Dick"
              ]
            },
            {
              "date": "2014-01-05",
              "people": [
                "Dick"
              ]
            }
        ]
    }
};

describe("Event Service", () => {

    const app = new Koa();
    let config: any;

    beforeAll(async () => {
        await dbUtils.createConnection();
        await dbUtils.clear();
        await dbUtils.dumpTestData();

        config = await initConfig(app);
    })

    afterAll(async () => {
        await dbUtils.clear();
        await dbUtils.closeConnection();
    })

    it(
        "GET /list should return a list of events",
        async (done) =>
    {
        // TODO: Insert test data to db
        const response = await request(app.callback())
            .get("/list")
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/);
        expect(response.body).toEqual(expectedResponses.listEvents);
        done();
    });

    it(
        "GET /:id should return a single event",
        async () =>
    {
        // TODO: Insert test data to db
        const response = await request(app.callback())
            .get(`/${testRequests.getEventResults.params.id}`)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/);
        expect(response.body).toEqual(expectedResponses.getEvent);
    });

    it(
        "GET /:id/results should return event metadata with suitable dates for all participants",
        async () =>
    {
        // TODO: Insert test data to db
        const response = await request(app.callback())
            .get(`/${testRequests.getEventResults.params.id}/results`)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/);
        expect(response.body).toEqual(expectedResponses.getEventResults);
    });

    it(
        "POST / should create new event and return it's id",
        async () =>
    {
        const response = await request(app.callback())
            .post("/")
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/);
        expect(response.body).toEqual(expectedResponses.insertEvent);
    });

    it(
        "POST /:id/vote should create new votes for an event and return new event status",
        async () =>
    {
        // TODO: Insert test data to db
        const response = await request(app.callback())
            .post(`/${testRequests.insertVote.params.id}/vote`)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/);
        expect(response.body).toEqual(expectedResponses.insertVote);
    });
});
