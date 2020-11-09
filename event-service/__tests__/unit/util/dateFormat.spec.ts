import { configureDateFormatType, formatDate } from "@src/util/dateFormat";

describe("dateFormat module", () => {
    it("should convert timestamp to dates correctly", () => {
        const timestamp = 1388880000000;

        let config: any = {dateFormatType: "unix"};
        configureDateFormatType(config);
        expect(formatDate(timestamp)).toEqual(timestamp);

        config = {dateFormatType: "isodate"};
        configureDateFormatType(config);
        expect(formatDate(timestamp)).toEqual("2014-01-05");

        config = {dateFormatType: "isodatetime"};
        configureDateFormatType(config);
        expect(formatDate(timestamp)).toEqual("2014-01-05T00:00:00.000Z");
    });
});
