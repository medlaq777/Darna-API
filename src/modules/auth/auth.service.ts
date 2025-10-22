import prisma from "../../database/prisma.ts";
import HashProcess from "../../utils/hash.ts";
import JWT from "../../utils/jwt.ts";
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
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) throw new Error("Email already used");

    const hashed = await HashProcess.hash(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        ...(name && { name })
      }
    })

    const code = this.generateOTP();
    const expiresAt = addMinutes(new Date(), OTP_TTL_MIN);

    await prisma.otp.create({
      data: {
        usersId: user.id,
        code,
        type: "EMAIL_VERIFY",
        expiresAt,
      },
    });
    await MailService.sendOtp(email, code, "VERIFY");

    return { success: true, message: "User Created. Verify Your Email." }
  }

  async verifyEmail(email: string, code: string) {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) throw new Error("User Not Found");

    const otp = await prisma.otp.findFirst({
      where: {
        usersId: user.id,
        code,
        type: "EMAIL_VERIFY",
        used: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { expiresAt: "desc" },
    });

    if (!otp) throw new Error("OTP Expired Or Not Found")

    await prisma.otp.update({ where: { id: otp.id }, data: { used: true } });
    await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });

    return { success: true }
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user || !user.password) throw new Error("Your email or password is incorrect");
    const ok = await HashProcess.compare(password, user.password);
    if (!ok) throw new Error("Email or password is incorrect")
    if (!user.isVerified) throw new Error("Email not verified")
    if (user.twoFaEnabled) {
      const code = this.generateOTP();
      const expiresAt = addMinutes(new Date(), OTP_TTL_MIN);
      await prisma.otp.create({
        data: { usersId: user.id, code, type: "2FA", expiresAt },
      });
      await MailService.sendOtp(user.email, code, "2FA");
      const pendingJwt = JWT.sign({ sub: user.id, pending2FA: true, expiresIn: "5m" });
      return { requires2FA: true, pendingToken: pendingJwt };
    }
    const token = JWT.sign({ sub: user.id, email: user.email });
    return { token };
  }

  async verify2FA(pendingToken: string, code: string) {
    let payload: any;
    try {
      payload = JWT.verify(pendingToken);
    } catch (err) {
      throw new Error("Expired Token or invalide");
    }
    if (!payload || !payload.pending2FA || !payload.sub) throw new Error("Invalide Token");
    const userId = payload.sub;
    const otp = await prisma.otp.findFirst({
      where: { usersId: userId, code, type: "2FA", used: false, expiresAt: { gt: new Date() } }, orderBy: { expiresAt: "desc" },
    });
    if (!otp) throw new Error("2FA Invalide or expired")
    await prisma.otp.update({ where: { id: otp.id }, data: { used: true } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const token = JWT.sign({ sub: userId, email: user?.email });
    return { token };
  }

  async enable2FA(userId: string) {
    await prisma.user.update({ where: { id: userId }, data: { twoFaEnabled: true } });
    return { success: true, message: "2FA Verified" };
  }
}


export default new AuthService();
