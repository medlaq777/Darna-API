import dotenv from "dotenv";
dotenv.config();
export const config = {
  PORT: process.env.PORT || 3000,
  JWTSECRET: process.env.JWT_SECRET,
  JWTEXPIRESIN: process.env.JWT_EXPIRES_IN,
  EMAIL_USER: process.env.MAIL_USER,
  EMAIL_PASS: process.env.MAIL_PASS,
};
