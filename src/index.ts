import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { errorHandlingMiddleware, loggingMiddleware } from './middlewares.js';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(errorHandlingMiddleware);//global middleware for handling errors

app.use(loggingMiddleware);//global middleware for logging requests

app.use(cookieParser());//global middleware for parsing cookies
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
    res.cookie('hello', 'world', { maxAge: 600000, httpOnly: true });
    res.send('Hello, World!');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
