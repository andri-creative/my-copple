import express from "express";
import { updateSchema } from "./update-schema";

const app = express();

app.use(express.json());

app.use('/', (req, res) => {
    res.json({
        message: "Copple my",
        status: false,

    })
})

// Hapus updateSchema() dari sini agar tidak bentrok atau jalan dua kali
export default app;