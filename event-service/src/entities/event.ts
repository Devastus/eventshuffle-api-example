import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, JoinColumn } from "typeorm";
import EventDate from "./eventDate";
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
        this.participants = data.participants;
        this.createdAt = data.createdAt;
        this.modifiedAt = data.modifiedAt;
    }

    static filterToJsonPresentation(event: Event): any {
        const result = {
            id: event.id,
            name: event.name,
            dates: [],
            votes: []
        };

        if (event.dates.length > 0) {
            result.dates = event.dates.map((eventDate: EventDate) => eventDate.format());
        }

        if (event.votes.length > 0) {
            result.votes = event.votes.map((vote: Vote) => {
                return {
                    date: vote.date.format(),
                    people: vote.people.map((p: any) => p.name)
                };
            });
        }
        return result;
    }

    static filterToResultsPresentation(event: Event): any {
        const result = {
            name: event.name,
            suitableDates: []
        };

        // Filter and format suitable dates for _all_ participants
        if (event.votes.length < 1){
            result.suitableDates = [];
        } else {
            result.suitableDates = event.votes
                .filter((item: Vote) => item.people.length === event.participants.length)
                .map((item: Vote) => {
                    return {
                        date: item.date.format(),
                        people: item.people.map((p: any) => p.name)
                    };
                });
        }
        return result;
    }
}
