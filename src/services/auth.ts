import { EntityManager } from "@mikro-orm/core";
import { User } from "../entities/User";
import { Session } from "../entities/Session";
import { Role } from "../entities/Role";
import { Profils } from "../entities/Profils";
import bcrypt from "bcrypt";
import crypto from "crypto";

export class AuthService {
    constructor(private readonly em: EntityManager) {}

    // Method untuk Menghasilkan Code Unik bagi Pasangan (Contoh Output: '7A1B2C')
    private generateCoupleCode(): string {
        return crypto.randomBytes(3).toString("hex").toUpperCase();
    }

    // 1. REGISTER EMAIL
    async registerEmail(data: any) {
        const { email, password, nickname } = data;

        // Cek apakah user sudah terdaftar
        const existingUser = await this.em.findOne(User, { email });
        if (existingUser) {
            throw new Error("Email ini sudah digunakan");
        }

        // Enkripsi kata sandi
        const hashedPassword = await bcrypt.hash(password, 10);

        // A. Buat entitas User baru
        const user = new User();
        user._id = crypto.randomBytes(12).toString("hex");
        user.email = email;
        user.password = hashedPassword;
        user.nickname = nickname || "Anonim";
        user.provider = "local";
        user.code = this.generateCoupleCode(); // Buatkan code couple!

        // B. Buat entitas Role dasar
        const role = new Role();
        role._id = crypto.randomBytes(12).toString("hex");
        role.userId = user;
        role.role = "user"; // default level

        // C. Buat entitas Profils kosong (menghindari error bawaan dari tabel)
        const profil = new Profils();
        profil._id = crypto.randomBytes(12).toString("hex");
        profil.userId = user;
        profil.bio = "";
        profil.gender = "unknown";
        profil.birthDate = new Date();
        profil.pictures = ""; 

        // Simpan semuanya dan push ke Database
        this.em.persist([user, role, profil]);
        await this.em.flush();

        return user;
    }

    // 2. LOGIN EMAIL
    async loginEmail(data: any, deviceInfo?: string, ipAddress?: string) {
        const { email, password } = data;

        const user = await this.em.findOne(User, { email });
        if (!user || user.provider !== "local") {
            throw new Error("Kredensial tidak cocok atau mendaftar menggunakan metode lain (seperti google)");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Password salah");
        }

        // Generate Token & Session!
        return this.createSession(user, deviceInfo, ipAddress);
    }

    // 3. LOGIN & REGISTER VIA GOOGLE (OAUTH)
    async loginGoogle(googleProfile: any, deviceInfo?: string, ipAddress?: string) {
        // googleProfile biasanya didapatkan setelah dari token decoding auth google
        const { email, name, picture } = googleProfile;

        // Periksa apakah user gmail sudah terdaftar di aplikasi?
        let user = await this.em.findOne(User, { email });

        // Jika Belum Terdaftar, Langsung Daftarkan (Automated Register)!
        if (!user) {
            user = new User();
            user._id = crypto.randomBytes(12).toString("hex");
            user.email = email;
            user.password = "";
            user.nickname = name || "Google User";
            user.provider = "google";
            user.code = this.generateCoupleCode();

            const role = new Role();
            role._id = crypto.randomBytes(12).toString("hex");
            role.userId = user;
            role.role = "user";

            const profil = new Profils();
            profil._id = crypto.randomBytes(12).toString("hex");
            profil.userId = user;
            profil.bio = " ";
            profil.gender = "unknown";
            profil.birthDate = new Date();
            profil.pictures = picture || ""; 

            this.em.persist([user, role, profil]);
            await this.em.flush();
        }

        return this.createSession(user, deviceInfo, ipAddress);
    }

    // 4. LOGIN & REGISTER VIA APPLE ID
    async loginApple(appleProfile: any, deviceInfo?: string, ipAddress?: string) {
        const { email, name } = appleProfile;

        let user = await this.em.findOne(User, { email });

        if (!user) {
            user = new User();
            user._id = crypto.randomBytes(12).toString("hex");
            user.email = email;
            user.password = "";
            user.nickname = name || "Apple User";
            user.provider = "apple";
            user.code = this.generateCoupleCode();

            const role = new Role();
            role._id = crypto.randomBytes(12).toString("hex");
            role.userId = user;
            role.role = "user";

            const profil = new Profils();
            profil._id = crypto.randomBytes(12).toString("hex");
            profil.userId = user;
            profil.bio = " ";
            profil.gender = "unknown";
            profil.birthDate = new Date();
            profil.pictures = ""; 

            this.em.persist([user, role, profil]);
            await this.em.flush();
        }

        return this.createSession(user, deviceInfo, ipAddress);
    }

    // METHOD INTERNAL (DIGUNAKAN UNTUK LOGIN)
    private async createSession(user: User, device?: string, ipAddress?: string) {
        const session = new Session();
        session._id = crypto.randomBytes(12).toString("hex");
        session.userId = user;
        session.token = crypto.randomBytes(32).toString("hex");

        session.device = device;
        session.ipAddress = ipAddress;
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        session.expiresAt = expiresAt;

        await this.em.persistAndFlush(session);

        return {
            user,
            token: session.token
        };
    }
}
