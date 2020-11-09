import { Entity, PrimaryColumn } from "typeorm";
import { formatDate } from "../util/dateFormat";

@Entity("event_date")
export default class EventDate {
    @PrimaryColumn("bigint")
    date: bigint;

    constructor(data: any) {
        if (!data) return;
        this.date = data.date || 0;
    }

    format() {
        return formatDate(Number(this.date));
    }
}
