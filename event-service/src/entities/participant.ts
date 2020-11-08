import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, OneToOne, ManyToMany } from "typeorm";
import Vote from "./vote";
import Event from "./event";

@Entity("participant")
export default class Participant {
    @PrimaryColumn({length: 100})
    name: string;

    // @ManyToMany(type => Event, event => event.participants)
    // events: Event[]

//     @ManyToMany(type => Vote, vote => vote.people)
//     votes: Vote[]

    constructor(data: any) {
        if (!data) return;
        this.name = data.name || "";
        // this.events = data.events;
        // this.votes = data.votes;
    }
}
