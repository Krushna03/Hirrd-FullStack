import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./models/user.model.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: '695301338025-6i0gerv3fas9m8mktb0rlt71q4tcj0sl.apps.googleusercontent.com',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/api/v1/users/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Find or create user
                let user = await User.findOne({ googleId: profile.id });
                if (!user) {
                    user = await User.create({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                    });
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
