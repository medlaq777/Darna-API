import passport from 'passport';
import { Strategy as GoogleStrategy, type VerifyCallback } from 'passport-google-oauth20';
import Config from '../config/index.ts';
import { googleAuthCallback } from '../modules/auth/auth.service.ts';

passport.use(new GoogleStrategy({
  clientID: Config.GOOGLE_CLIENT_ID!,
  clientSecret: Config.GOOGLE_CLIENT_SECRET!,
  callbackURL: Config.GOOGLE_CLIENT_CALLBACK_URL!,
  scope: ['profile', 'email'],
},
  async (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
    try {
      const user = await googleAuthCallback(profile);
      done(null, user);
    } catch (e) {
      done(e as Error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id: string, done) => {
  done(null, { id });
});

export default passport;
