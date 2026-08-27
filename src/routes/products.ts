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

//req.cookies vs req.headers.cookie
//req.cookies is an object that contains the cookies sent by the client in the request. 
//It is populated by the cookie-parser middleware, which parses the Cookie header and populates
//  req.cookies with an object containing the cookie names and values.

//loggingMiddleware is applied only to this route
router.get('/api/products', loggingMiddleware, (req: Request, res: Response) => {
    console.log(req.cookies); // Log the cookies sent by the client
    console.log(req.headers.cookie); // Log the raw cookie header

    if (req.cookies.hello && req.cookies.hello === 'world') {
        return res.status(200).json(products);
    } else {
        return res.status(403).json({ error: 'Forbidden: Missing or invalid cookie' });
    }
});

export default router;