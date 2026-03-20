import express from "express";
import { updateSchema } from "./update-schema";

const app = express();

app.use(express.json());

app.use('/', (req, res) => {
    res.json({
        message: "Copple my",
        status: false,
        data: {
            name: "Copple",
            version: "1.0.0",
        }
    })
})

// Hapus updateSchema() dari sini agar tidak bentrok atau jalan dua kali
export default app;