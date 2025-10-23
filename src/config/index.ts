import dotenv from "dotenv";
dotenv.config();
export const config = {
  PORT: process.env.PORT || 3000,
  JWTSECRET: process.env.JWT_SECRET,
  JWTEXPIRESIN: process.env.JWT_EXPIRES_IN,
  EMAIL_USER: process.env.MAIL_USER,
  EMAIL_PASS: process.env.MAIL_PASS,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_CALLBACK_URL: process.env.GOOGLE_CLIENT_CALLBACK_URL,
};
