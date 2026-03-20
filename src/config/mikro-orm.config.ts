import { defineConfig } from "@mikro-orm/mongodb";
import { User } from "../entities/User";

const config = defineConfig({
    entities: [User],
    clientUrl: "mongodb+srv://Vercel-Admin-copple-chat:J4nnxsr2VgozQdmJ@copple-chat.t9v2f3j.mongodb.net/?retryWrites=true&w=majority",
    dbName: "copple-chat",
});

export default config;