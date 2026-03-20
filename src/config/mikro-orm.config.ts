import { defineConfig } from "@mikro-orm/mongodb";
import { User } from "../entities/User";
import { Profils } from "../entities/Profils";
import { Role } from "../entities/Role";
import { Session } from "../entities/Session";

const config = defineConfig({
    entities: [User, Profils, Role, Session],
    clientUrl: "mongodb+srv://Vercel-Admin-copple-chat:J4nnxsr2VgozQdmJ@copple-chat.t9v2f3j.mongodb.net/?retryWrites=true&w=majority",
    dbName: "copple-chat",
    ensureIndexes: true,
});

export default config;