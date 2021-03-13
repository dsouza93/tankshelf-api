import { Verify } from 'crypto';
import { access } from 'fs';
import { Profile, VerifyCallback } from 'passport-google-oauth20';
import { config } from '../config';
import * as UserSerivce from '../users/users.service';
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
        console.log(`inside passport Google OAuth Strategy callback, looking for or creating user then serializing...`)
        try {
            RegService.findOrCreate(profile).then(user => {
                console.log('inside G OAuth Strat findOrCreate', user);
                done(null, user);
            });

        } catch(e) {
            done(e, false, e.message);
        }
        
    })
);


passport.serializeUser(function(user: Express.User, done) {
    console.log(`inside seralizeUser`)
    console.log(user);
    console.log(user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(function(userId: number, done) {
      console.log(`inside deserailizeUser`);
      UserSerivce.findWhere("id", userId)
      .then(user => {
        console.log(`Found user: ${user}`);
        done(null, user);
      });

      
  });