import passport from 'passport';
import { Strategy } from 'passport-local';
import { users } from '../routes/users.js';


passport.serializeUser((user: Express.User, done) => {
    console.log('Serializing user:', user);
    done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
    console.log('Deserializing user with ID:', id);
    const user = users.find(u => u.id === id);
    if (!user) {
        return done(new Error('User not found'));
    }
    done(null, user);
});

// This function is called when passport.authenticate('local') is used.
// passport-local expects `username` by default, but this application uses `email`.
const localStrategy = new Strategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
        console.log(`Authenticating user: ${email}`);
        try {
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                return done(null, false, { message: 'Invalid credentials' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    },
);

export default passport.use('local', localStrategy);

//how can i import it?
//You can import the local strategy in your main application file (e.g., index.ts) to initialize it. Here's how you can do it:
//import './passport-strategies/local-strategy.js'; // Import the local strategy to initialize it