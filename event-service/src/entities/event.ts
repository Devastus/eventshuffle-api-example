import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, JoinColumn } from "typeorm";
import EventDate from "./eventdate";
import Participant from "./participant";
import Vote from "./vote";

@Entity("event")
export default class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    name: string;

    @ManyToMany(type => EventDate, {cascade: true})
    @JoinTable()
    dates: EventDate[];

    @OneToMany(type => Vote, vote => vote.event, {cascade: true})
    @JoinColumn({referencedColumnName: "id"})
    votes: Vote[];

    @ManyToMany(type => Participant, {cascade: true})
    @JoinTable()
    participants: Participant[];

    @Column("bigint")
    createdAt: bigint;

    @Column("bigint")
    modifiedAt: bigint;

    constructor(data: any) {
        if (!data) return;
        if (data.id) this.id = data.id;
        this.name = data.name;
        this.dates = data.dates;
        this.votes = data.votes;
        this.createdAt = data.createdAt;
        this.modifiedAt = data.modifiedAt;
    }
}
