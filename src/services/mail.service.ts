import nodemailer, { type Transporter } from "nodemailer";
import Config from "../config/index.ts";
import dotenv from "dotenv";
dotenv.config();

class MailService {
  private transporter: Transporter;
  private user: string;

  constructor() {
    this.user = Config.EMAIL_USER || "";
    const pass = Config.EMAIL_PASS || "";
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.user,
        pass,
      },
    });
  }

  async sendOtp(to: string, code: string, purpose: "2FA" | "VERIFY"): Promise<void> {
    const subject = purpose === "2FA" ? "Votre code 2FA" : "VERIFY YOUR EMAIL";
    const text = `THIS IS YOUR CODE ${purpose === "2FA" ? "2FA" : "FOR VERIFICATION"}:${code} IT WILL BE EXPIRED AFTER SECONDS.`;

    await this.transporter.sendMail({
      from: this.user,
      to,
      subject,
      text,
      html: `<p>${text}</p>`,
    });
  }
}

export default new MailService();
