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


