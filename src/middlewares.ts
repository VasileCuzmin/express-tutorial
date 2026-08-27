import { type NextFunction, type Request, type Response } from 'express';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

export const errorHandlingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const findUserByUserId = (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    req.userId = userId;
    next();
};