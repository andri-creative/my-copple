import { Request, Response } from "express";
import { RequestContext } from "@mikro-orm/core";
import { CoupleService } from "../services/couple";
import { User } from "../entities/User";

export const coupleController = {
  // A. Menghubungkan Pasangan
  async connectPartner(req: Request, res: Response) {
    try {
      const em = RequestContext.getEntityManager();
      const sessionUser = (req as any).user; 

      // Untuk mencegah data tertinggal di memory, kita tarik data "tersegar" (fresh query) 
      // dari database termasuk kolom .partner nya
      const currentUser = await em!.findOne(User, { _id: sessionUser._id }, { populate: ['partner'] });
      
      const { code } = req.body; 

      if (!code) {
          return res.status(400).json({ success: false, message: "Atribut 'code' harus diisi."});
      }

      const coupleService = new CoupleService(em!);
      const result = await coupleService.connectPartner(currentUser!, code);

      res.status(200).json({ success: true, message: "Berhasil Terhubung Dengan Pasangan!", data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // B. Memutuskan Hubungan
  async disconnectPartner(req: Request, res: Response) {
    try {
      const em = RequestContext.getEntityManager();
      const sessionUser = (req as any).user;

      const currentUser = await em!.findOne(User, { _id: sessionUser._id }, { populate: ['partner'] });

      const coupleService = new CoupleService(em!);
      await coupleService.disconnectPartner(currentUser!);

      res.status(200).json({ success: true, message: "Berhasil memutuskan ikatan dari pasangan Anda." });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};
