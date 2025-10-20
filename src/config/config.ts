const Config={
  port: process.env.PORT||3000,
  jwtSecret:process.env.JWT_SECRET,
  jwtExpires:process.env.JWT_EXPIRES_IN,
  mailUser:process.env.MAIL_USER,
  mailPass:process.env.MAIL_pass
}


export default Config;
