const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Use environment variable for security
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Use environment variable for security
    callbackURL: 'https://aid-venture.com/auth/google/callback',
    scope: ['profile', 'email'], // Scopes define the access level of the user data you want to retrieve
},
function(accessToken, refreshToken, profile, cb) {
    // This callback is called after the user successfully authenticates with Google
    // You can store user data in your database here or handle other logic
    console.log('User Profile:', profile); // Log user profile for debugging
    return cb(null, profile); // Pass the profile to the next step
}));

// Serialize user to session
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

// Deserialize user from session 
passport.deserializeUser(function(user, cb) {
    cb(null, user);
});