import jwt from "jsonwebtoken";
import Config from "../config/index.ts";
import dotenv from "dotenv";

dotenv.config();


class JWT {
  private static secret = Config.JWTSECRET;
  private static expiresIn = Config.JWTEXPIRESIN;
  private static pendingExpiresIn = Config.JWTPENDINGEXPIRESIN;

  static sign(payload: object, opts?: { pending?: boolean }): string {
    const expires = opts?.pending ? this.pendingExpiresIn : this.expiresIn;
    if (!this.secret) {
      throw new Error("JWT secret is not defined in environment variables.");
    }
    if (!expires) {
      throw new Error("JWT expiration is not defined in environment variables.");
    }
    const options: jwt.SignOptions = { expiresIn: expires as any };
    return jwt.sign(payload as any, this.secret as jwt.Secret, options);
  }

  static verify(token: string): object | string {
    if (!this.secret) {
      throw new Error("JWT secret is not defined in environment variables.");
    }
    return jwt.verify(token, this.secret)
  }
}

export default JWT;
