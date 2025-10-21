import prisma from "../../database/prisma.ts";
import HashProcess from "../../utils/hash.ts";
import crypto from "crypto";
import { addMinutes } from "date-fns";
import MailService from "../../services/mail.service.ts"

const OTP_TTL_MIN = 10;

type OTPType = "EMAIL_VERIFY" | "2FA";

class AuthService {
  private generateOTP(): string {
    return crypto.randomBytes(3).toString("hex").toUpperCase();
  }

  async register(email: string, password: string, name?: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already used");

    const hashed = await HashProcess.hash(password);
    const user = await prisma.user.create({
      data: { email, password: hashed, name }
    })

    const code = this.generateOTP();
    const expiresAt = addMinutes(new Date(), OTP_TTL_MIN);

    await prisma.Otp.create({
      data: {
        userId: user.id,
        code,
        type: "EMAIL_VERIFY",
        expiresAt,
      },
    });
    await MailService.sendOtp(email, code, "VERIFY");

    return { success: true, message: "User Created. Verify Your Email." }
  }

  async verifyEmail(email: string, code: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User Not Found");

    const otp = await prisma.Otp.findFirst({
      where: {
        userId: user.id,
        code,
        type: "EMAIL_VERIFY",
        used: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { expiresAt: "desc" },
    });

    if (!otp) throw new Error("OTP Expired Or Not Found")

    await prisma.Otp.update({ where: { id: otp.id }, data: { used: true } });
    await prisma.user.update({ where: { id: user.id }, data: { emailVerify: true } });

    return { success: true }
  }
}


export default new AuthService();
