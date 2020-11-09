import { getRepository, getConnection } from "typeorm";
import { connectDatabase } from "@src/config";
import { events } from "./data";
import Event from "@src/entities/event";
import EventDate from "@src/entities/eventDate";
import Vote from "@src/entities/vote";
import Participant from "@src/entities/participant";

export default {
    async createConnection() {
        await connectDatabase();
    },

    async clear() {
        await getRepository(Event).clear();
        await getRepository(EventDate).clear();
        await getRepository(Vote).clear();
        await getRepository(Participant).clear();
    },

    async closeConnection() {
        await getConnection().close();
    },

    async dumpTestData() {
        for(const ev of events) {
            await getRepository(Event).save(ev);
        }
    }
}
