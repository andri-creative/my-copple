import { EntityManager } from "@mikro-orm/core";
import { Profils } from "../entities/Profils";
import { User } from "../entities/User";

export class ProfileService {
    constructor(private readonly em: EntityManager) {}

    // A. Mengambil Data Profil Sendiri Saat Ini
    async getProfile(user: User) {
        const profil = await this.em.findOne(Profils, { userId: user });
        if (!profil) throw new Error("Data profil rusak/terhapus, hubungi admin");
        
        return profil;
    }

    // B. Mengubah Isi Data Profil (Digunakan Oleh Frontend / User)
    async updateProfile(user: User, data: any) {
        const profil = await this.em.findOne(Profils, { userId: user });
        if (!profil) throw new Error("Data profil rusak/terhapus");

        // Jika mereka mengirim perubahan data "bio", maka replace datanya!
        if (data.bio !== undefined) profil.bio = data.bio;
        if (data.gender !== undefined) profil.gender = data.gender;
        if (data.pictures !== undefined) profil.pictures = data.pictures;
        
        // Cek jika mengirim data tanggal dan jadikan Date object yang valid 
        if (data.birthDate !== undefined) {
             profil.birthDate = new Date(data.birthDate);
        }

        // Tembak data baru ini kedalam sistem database...
        await this.em.flush();
        return profil;
    }
}
