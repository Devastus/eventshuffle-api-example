import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { formatDate } from "../util/dateFormat";

@Entity("event_date")
export default class EventDate {
    // Apparently bigints need to be represented as strings in TypeORM
    @PrimaryColumn("bigint")
    date: bigint;

    constructor(data: any) {
        if (!data) return;
        this.date = data.date || 0;
    }

    format() {
        return formatDate(this.date);
    }
}
