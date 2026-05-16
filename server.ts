import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/verify-recaptcha", async (req, res) => {
    const { token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    console.log("reCAPTCHA Secret Key present:", !!secretKey);

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    try {
      const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
        method: "POST",
      });
      const data: any = await response.json();
      console.log("reCAPTCHA Google Response:", data);
      res.json(data);
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SAKTI Server running on http://localhost:${PORT}`);
  });
}

startServer();
