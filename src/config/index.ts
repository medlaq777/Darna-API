import dotenv from "dotenv";
dotenv.config();
export default {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  smtp: {
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASS!,
  },
};
