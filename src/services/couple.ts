import { EntityManager } from "@mikro-orm/core";
import { User } from "../entities/User";

export class CoupleService {
    constructor(private readonly em: EntityManager) {}

    // A. Menghubungkan dua user menjadi "Couple"
    async connectPartner(currentUser: User, partnerCode: string) {
        // 1. Cek User Asal: Apakah kita sendiri sudah "Taken"?
        if (currentUser.partner) {
            throw new Error("Anda sudah memiliki pasangan! Lepaskan ikatan dulu untuk pasangan baru.");
        }

        // 2. Cek User Tujuan: Cari di database siapa pemilik kode ini
        const targetPartner = await this.em.findOne(User, { code: partnerCode }, { populate: ['partner'] });

        if (!targetPartner) {
            throw new Error("Kode pasangan Tidak Valid atau Tidak Ditemukan.");
        }

        // 3. Mencegah bug: Tidak boleh mengikat dengan diri sendiri
        if (targetPartner._id === currentUser._id) {
            throw new Error("Anda tidak diperbolehkan memasukkan kode pasangan milik Anda sendiri.");
        }

        // 4. Mencegah orang ketiga: Apakah tujuan kita sudah diikat orang lain duluan?
        if (targetPartner.partner) {
            throw new Error("Mohon maaf, User pemilik kode ini sudah memiliki pasangan.");
        }

        // 5. SAH: Hubungkan keduanya layaknya One-to-One
        currentUser.partner = targetPartner;
        targetPartner.partner = currentUser;

        await this.em.flush();

        return {
            me: currentUser,
            myPartner: targetPartner
        };
    }

    // B. Memutuskan relasi "Couple" (Break Up/Disconnect)
    async disconnectPartner(currentUser: User) {
        if (!currentUser.partner) {
            throw new Error("Anda saat ini sedang berstatus Single (Belum berpasangan).");
        }

        // Cari tahu siapakah pasangannya (berdasarkan ID relasi di currentUser.partner)
        const partner = await this.em.findOne(User, { _id: currentUser.partner._id });

        // Lepaskan juga ikatan dari sisi pasangan kita, agar dia juga menjadi "Single" kembali
        if (partner) {
            partner.partner = undefined;
        }

        // Lepaskan ikatan kita sendiri menjadi kosong/undefined
        currentUser.partner = undefined;

        await this.em.flush();

        return true;
    }
}
