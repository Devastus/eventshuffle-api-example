import { dates } from "../../testutils/data";
jest.mock("@src/util/dateFormat");
import { configureDateFormatType, formatDate } from "@src/util/dateFormat";
import EventDate from "@src/entities/eventDate";

describe("EventDate", () => {
    it("should call formatDate on format()", (done) => {
        const date = new EventDate({ date: 1388880000000 });
        date.format();
        expect(formatDate).toBeCalled();
        done();
    });

    it("should perform comparison with numberEquals", (done) => {
        const date1 = new EventDate({ date: 1388880000000 });
        let date2 = new EventDate({ date: 1388880000000 });
        expect(date1.numberEquals(date2)).toBeTruthy();

        date2 = new EventDate({ date: 1388534400000 });
        expect(date1.numberEquals(date2)).toBeFalsy();

        done();
    });

    it("should parse date string into an EventDate on fromDateString", (done) => {
        const date = EventDate.fromDateString("2014-01-05");
        expect(date).toBeDefined();
        expect(date.date).toEqual(1388880000000);
        done();
    });

    it("should parse date strings into EventDates on fromDateStringArray", (done) => {
        const dateStrings = [
            "2014-01-01",
            "2014-01-05"
        ];
        const dates = EventDate.fromDateStringArray(dateStrings);
        expect(dates).toBeDefined();
        expect(Array.isArray(dates)).toBeTruthy();
        expect(dates[0].date).toEqual(1388534400000);
        expect(dates[1].date).toEqual(1388880000000);
        done();
    });
});
