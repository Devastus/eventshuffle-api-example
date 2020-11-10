import moment from "moment";
import { Configuration } from "../config";

export type DateFormatType = "unix" | "isodatetime" | "isodate";
let FORMAT_TYPE: DateFormatType = "unix";

export function configureDateFormatType(configuration: Configuration) {
    FORMAT_TYPE = configuration.dateFormatType;
}

export function formatDate(time: any) {
    switch (FORMAT_TYPE) {
        case "isodatetime":
            return moment(time).toISOString();
        case "isodate":
            return moment(time).format("YYYY-MM-DD");
        default:
            return time;
    }
}

export function unixSecondsToDate(time: any) {
    return new Date(Number(time) * 1000);
}

export function dateToUnixSeconds(date: Date) {
    return date.getTime() / 1000;
}
