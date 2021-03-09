import { Verify } from 'crypto';
import { access } from 'fs';
import { Profile, VerifyCallback } from 'passport-google-oauth20';
import { config } from '../config';
import * as RegService from '../services/registration.service';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Set up Google AuthO strategy
passport.use(
    new GoogleStrategy({
        clientID: config.auth.GOOG_CLIENT_ID,
        clientSecret: config.auth.GOOG_CLIENT_SECRET,
        callbackURL: "http://localhost:7000/auth/google/redirect"
    },
    (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            RegService.findOrCreate(profile).then(user => {
                console.log(user);
                done(null, user);
            });

        } catch(e) {
            done(e, false, e.message);
        }
        
    })
);


passport.serializeUser(function(user: Express.User, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user: Express.User, done) {
      done(null, user);
  });