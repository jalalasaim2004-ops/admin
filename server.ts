import express from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import path from "path";
import dotenv from "dotenv";
import cron from "node-cron";
import nodemailer from "nodemailer";

dotenv.config();

// Mock data to simulate DB for cron job
const mockAppointmentsForCron = [
  {
    id: "a1",
    patientEmail: "patient@example.com",
    doctorName: "د. أحمد محمود",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    time: "10:30 ص",
  }
];

async function setupEmailService() {
  // Create a test account on Ethereal for testing emails
  const testAccount = await nodemailer.createTestAccount();
  
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON bodies
  app.use(express.json());

  // Initialize Email Service
  let emailTransporter: nodemailer.Transporter | null = null;
  setupEmailService().then(transporter => {
    emailTransporter = transporter;
    console.log("Email service initialized (Ethereal).");
  }).catch(console.error);

  // Setup Cron Job for Reminders (Runs every hour)
  cron.schedule("0 * * * *", async () => {
    console.log("Running appointment reminder cron job...");
    if (!emailTransporter) return;

    // In a real app, query DB for appointments happening in exactly 24 hours
    for (const appt of mockAppointmentsForCron) {
      try {
        const info = await emailTransporter.sendMail({
          from: '"منصة شفاء" <noreply@shifa.com>',
          to: appt.patientEmail,
          subject: "تذكير بموعدك الطبي غداً",
          text: `مرحباً، نود تذكيرك بموعدك مع ${appt.doctorName} غداً الموافق ${appt.date} الساعة ${appt.time}.`,
          html: `<b>مرحباً،</b><br>نود تذكيرك بموعدك مع <b>${appt.doctorName}</b> غداً الموافق ${appt.date} الساعة ${appt.time}.`,
        });
        console.log("Reminder email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
      } catch (err) {
        console.error("Failed to send reminder email:", err);
      }
    }
  });

  // Initialize Stripe lazily
  let stripeClient: Stripe | null = null;
  function getStripe(): Stripe {
    if (!stripeClient) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error("STRIPE_SECRET_KEY environment variable is required");
      }
      stripeClient = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
    }
    return stripeClient;
  }

  // API Routes
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { doctorId, doctorName, price, date, time } = req.body;
      
      const stripe = getStripe();
      
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "sar",
              product_data: {
                name: `موعد مع ${doctorName}`,
                description: `حجز موعد يوم ${date} الساعة ${time}`,
              },
              unit_amount: price * 100, // Stripe expects amounts in the smallest currency unit (halalas for SAR)
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${appUrl}/doctor/${doctorId}?canceled=true`,
      });

      res.json({ id: session.id });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
