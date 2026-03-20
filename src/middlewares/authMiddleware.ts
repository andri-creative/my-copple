import { Request, Response, NextFunction } from "express";
import { RequestContext } from "@mikro-orm/core";
import { Session } from "../entities/Session";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const em = RequestContext.getEntityManager();
        if (!em) return res.status(500).json({ success: false, message: "EM not found" });

        // Pemeriksaan Header Authentication (Bearer Token)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Akses ditolak. Token autentikasi tidak ditemukan." });
        }

        // Mengambil kode Token saja
        const token = authHeader.split(" ")[1];

        // Cari session di dalam database & Gabungkan (populate) beserta entitas User aslinya
        const session = await em.findOne(Session, { token, isRevoked: false }, { populate: ["userId"] });

        if (!session) {
            return res.status(401).json({ success: false, message: "Sesi tidak valid/sudah ditutup. Silakan login kembali." });
        }

        if (new Date() > session.expiresAt) {
            return res.status(401).json({ success: false, message: "Token (Sesi) ini sudah kadaluarsa." });
        }

        // Suntikkan data user ke dalam `req` agar bisa dibaca secara ajaib oleh Controller di tujuan akhir
        (req as any).user = session.userId;
        (req as any).session = session;

        next(); // Beri izin pengunjung API masuk!
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Internal Auth Error: " + error.message });
    }
};
