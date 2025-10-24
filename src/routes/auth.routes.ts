import express from "express";
import passport from "passport";
import Config from "../config/index.ts"
const r = express.Router() as any;

r.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

r.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: Config.FRONTEND_URL + "?error=login_failed", session: false }), (req: any, res: any) => {
  const { token } = req.user as any;
  if (!token) {
    return res.redirect(Config.FRONTEND_URL + "error=token_missing");
  }
  res.redirect(`${Config.FRONTEND_URL}?token=${token}`);
})

export default r;
