/* import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";

import {
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CALLBACK_URL,
} from "../config/global.js";

passport.use(
  "auth-google",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
 */