import { events } from "../../testutils/data";
import { configureDateFormatType } from "@src/util/dateFormat";
import Event from "@src/entities/event";

describe("Event", () => {
    it("should filter to simplified JSON on filterToJsonPresentation", (done) => {
        configureDateFormatType({ dateFormatType: "isodate" } as any);
        const event = {...events[0]};
        const expectedOutput: any = {
            id: 1,
            name: "Jake's secret party",
            dates: [
                "2014-01-01",
                "2014-01-05",
                "2014-01-12",
            ],
            votes: [
                {
                    date: "2014-01-01",
                    people: [
                        "John",
                        "Julia",
                        "Paul",
                        "Daisy",
                        "Dick",
                    ]
                },
                {
                    date: "2014-01-05",
                    people: [ "Dick", ]
                }
            ]
        };
        const result = Event.filterToJsonPresentation(event);
        expect(result).toEqual(expectedOutput);
        done();
    });

    it("should filter results on filterToResultsPresentation", (done) => {
        configureDateFormatType({ dateFormatType: "isodate" } as any);
        const event = {...events[0]};
        const expectedOutput: any = {
            name: "Jake's secret party",
            suitableDates: [
                {
                    date: "2014-01-01",
                    people: [
                        "John",
                        "Julia",
                        "Paul",
                        "Daisy",
                        "Dick",
                    ]
                }
            ]
        };
        const result = Event.filterToResultsPresentation(event);
        expect(result).toEqual(expectedOutput);
        done();
    });
});
