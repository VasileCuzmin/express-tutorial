import { Router } from "express";
import { type Request, type Response } from 'express';
import { type Product } from '../@types/types.js';
import { loggingMiddleware } from "../middlewares.js";

const router = Router();

const products: Product[] = [
    {
        id: 1,
        name: 'Product 1',
        description: 'Description for Product 1',
        price: 19.99,
        category: 'Category A'
    },
    {
        id: 2,
        name: 'Product 2',
        description: 'Description for Product 2',
        price: 29.99,
        category: 'Category B'
    }
];

//loggingMiddleware is applied only to this route
router.get('/api/products', loggingMiddleware, (req: Request, res: Response) => {
    return res.status(200).json(products);
});

export default router;