import { Request, Response } from "express";
import { RequestContext } from "@mikro-orm/core";
import { ProfileService } from "../services/profile";

export const profileController = {
  // A. Endpoint Lihat Profil Sendiri
  async getMyProfile(req: Request, res: Response) {
    try {
      const em = RequestContext.getEntityManager();
      
      // Ambil user dari Request! (Tersedia otomatis karena kita pakai Middleware `requireAuth`)
      const user = (req as any).user; 

      const profileService = new ProfileService(em!);
      const profile = await profileService.getProfile(user);

      res.status(200).json({ success: true, message: "Berhasil mengambil Profil saya", data: profile });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // B. Endpoint Simpan Pembaruan Profil
  async updateMyProfile(req: Request, res: Response) {
    try {
      const em = RequestContext.getEntityManager();
      const user = (req as any).user;

      const profileService = new ProfileService(em!);
      const updatedProfile = await profileService.updateProfile(user, req.body);

      res.status(200).json({ success: true, message: "Profil berhasil diperbarui dan disimpan!", data: updatedProfile });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};
