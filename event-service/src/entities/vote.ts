import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import Event from "./event";
import EventDate from "./eventdate";
import Participant from "./participant";

@Entity("vote")
export default class Vote {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => Participant)
    @JoinTable()
    people: Participant[];

    @ManyToOne(type => EventDate)
    date: EventDate

    @ManyToOne(type => Event, event => event.votes)
    event: Event;

    @Column("bigint")
    createdAt: bigint;

    @Column("bigint")
    modifiedAt: bigint;

    constructor(data: any) {
        if (!data) return;
        if (data.id) this.id = data.id;
        this.event = data.event;
        this.date = data.date;
        this.people = data.people;
        this.createdAt = data.createdAt || 0;
        this.modifiedAt = data.modifiedAt || 0;
    }
}
