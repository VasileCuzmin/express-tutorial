import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { errorHandlingMiddleware, loggingMiddleware } from './middlewares.js';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import session from 'express-session';
import passport from 'passport';
import './passport-strategies/local-strategy.js';// import the local strategy to initialize it
import mongoose from 'mongoose';
import { users } from './routes/users.js';

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/express-tutorial-db').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.use(express.json());
app.use(errorHandlingMiddleware);//global middleware for handling errors

app.use(loggingMiddleware);//global middleware for logging requests

app.use(cookieParser());//global middleware for parsing cookies
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 600000, // 10 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    }
}));//global middleware for handling sessions

app.use(passport.initialize());//global middleware for initializing passport
app.use(passport.session());//global middleware for handling passport sessions

app.use(routes);//use the routes defined in src/routes/index.ts

// app.get('/', (req: Request, res: Response, next: NextFunction) => {
//     // This is a middleware function that logs the request method and URL
//     //it does not call the next so the next function will not be called and the request
//     //  will not proceed to the next middleware or route handler
// }, (req: Request, res: Response) => {
//     res.send('Hello, World!');// This is the route handler that is not called because the previous
//     // middleware does not call next()
// });

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.sessionID); // Log the session ID
    req.session.visited = true; // Set a session variable
    res.cookie('hello', 'world', { maxAge: 600000, httpOnly: true });
    res.send('Hello, World!');
});


// app.post('/api/auth', (req: Request, res: Response) => {
//     const { body } = req;
//     const { name, password } = body;
//     const user = users.find(u => u.name === name && u.password === password);
//     if (!user || user.password !== password) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     req.session.user = user;
//     return res.status(200).json({ message: 'Authenticated', user });
// });

app.post('/api/auth', passport.authenticate('local'), (req: Request, res: Response) => {
    res.status(200).json({ message: 'Authenticated', user: req.user });
})

app.get('/api/auth/status', (req: Request, res: Response) => {
    console.log('Checking authentication status for user:', req.user);
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    return res.status(200).json({ authenticated: true, user: req.user });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    req.logout((err) => {
        if (err) { return res.status(500).json({ message: 'Logout failed', error: err }); }
        res.status(200).json({ message: 'Logged out' });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
