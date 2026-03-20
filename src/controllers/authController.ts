import { Request, Response } from "express";
import { RequestContext } from "@mikro-orm/core";
import { AuthService } from "../services/auth";

export const authController = {
  // 1. REGISTER
  async registerEmail(req: Request, res: Response) {
    try {
      // Dapatkan Entity Manager dari Request (standar MikroORM)
      const em = RequestContext.getEntityManager();
      if (!em) return res.status(500).json({ message: "Sistem Error: EM tidak ditemukan" });

      const authService = new AuthService(em);
      const user = await authService.registerEmail(req.body);
      
      res.status(201).json({ success: true, message: "Register Pendaftaran sukses", data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 2. LOGIN LOKAL
  async loginEmail(req: Request, res: Response) {
    try {
      const em = RequestContext.getEntityManager();
      if (!em) return res.status(500).json({ message: "Sistem Error: EM tidak ditemukan" });

      const authService = new AuthService(em);
      
      // Ambil device/IP bawaan express
      const deviceInfo = req.headers["user-agent"] || "unknown";
      const ipAddress = req.ip || "unknown";
      
      const sessionData = await authService.loginEmail(req.body, deviceInfo, ipAddress);

      res.status(200).json({ success: true, message: "Login sukses", data: sessionData });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  },

  // 3. OAUTH GOOGLE
  async loginGoogle(req: Request, res: Response) {
    try {
      const em = RequestContext.getEntityManager();
      if (!em) return res.status(500).json({ message: "Sistem Error: EM tidak ditemukan" });

      const authService = new AuthService(em);
      const deviceInfo = req.headers["user-agent"] || "unknown";
      const ipAddress = req.ip || "unknown";

      /* Catatan: Di Real World, body ini harusnya isinya Token ID / Access Token dari frontend, 
       yang di decoding oleh backend (google-auth-library) untuk memastikan itu bukan token bodong. 
       Anggaplah di contoh ini data google body sudah beres: */
      const googleProfile = req.body; 

      const sessionData = await authService.loginGoogle(googleProfile, deviceInfo, ipAddress);

      res.status(200).json({ success: true, message: "Login via Google sukses", data: sessionData });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // 4. OAUTH APPLE
  async loginApple(req: Request, res: Response) {
    try {
      const em = RequestContext.getEntityManager();
      if (!em) return res.status(500).json({ message: "Sistem Error: EM tidak ditemukan" });

      const authService = new AuthService(em);
      const deviceInfo = req.headers["user-agent"] || "unknown";
      const ipAddress = req.ip || "unknown";

      const appleProfile = req.body;

      const sessionData = await authService.loginApple(appleProfile, deviceInfo, ipAddress);

      res.status(200).json({ success: true, message: "Login via Apple sukses", data: sessionData });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};
