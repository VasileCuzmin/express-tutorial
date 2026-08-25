import { type Request, type Response } from 'express';


export const loggingMiddleware = (req: Request, res: Response, next: () => void) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

export const errorHandlingMiddleware = (err: Error, req: Request, res: Response, next: () => void) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
}