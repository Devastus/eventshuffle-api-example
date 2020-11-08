import { Entity, PrimaryColumn } from "typeorm";

@Entity("participant")
export default class Participant {
    @PrimaryColumn({length: 100})
    name: string;

    constructor(data: any) {
        if (!data) return;
        this.name = data.name || "";
    }
}
