import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


class JWT {
  private static secret = process.env.JWT_SECRET;
  private static expiresIn = process.env.JWT_EXPIRES_IN;
  private static pendingExpiresIn = process.env.JWT_PENDING_EXPIRES_IN;

  static sign(payload: object, opts?: { pending?: boolean }): string {
    const expires = opts?.pending ? this.pendingExpiresIn : this.expiresIn;
    if (!this.secret) {
      throw new Error("JWT secret is not defined in environment variables.");
    }
    if (!expires) {
      throw new Error("JWT expiration is not defined in environment variables.");
    }
    return jwt.sign(payload, this.secret, { expiresIn: parseInt(expires) });
  }

  static verify(token: string): object | string {
    if (!this.secret) {
      throw new Error("JWT secret is not defined in environment variables.");
    }
    return jwt.verify(token, this.secret)
  }
}

export default JWT;
