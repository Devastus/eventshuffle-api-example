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

    numberEquals(eventDate: EventDate): boolean {
        return Number(eventDate.date) === Number(this.date);
    }

    static fromDateString(date: string): EventDate {
        return new EventDate({ date: Date.parse(date) });
    }

    static fromDateStringArray(dates: string[]): EventDate[] {
        return dates.map((date: string) => EventDate.fromDateString(date));
    }
}
