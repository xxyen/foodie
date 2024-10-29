import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import mongoose from 'mongoose';
import 'dotenv/config';
import { User, UserCredential } from '../model/User';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/auth/google/callback',
      proxy: true,
      passReqToCallback: true,
    },
    async (req: any, accessToken: string, refreshToken: string, profile: Profile, done) => {
      try {
        console.log(profile);
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails?.[0].value,
          password: 'google-oauth', // Default password placeholder
          icon: profile.photos?.[0].value,
        });

        await user.save();
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
