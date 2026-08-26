import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { type User, type Product, type Query } from './@types/types.js';
import { errorHandlingMiddleware, loggingMiddleware, findUserByUserId } from './middlewares.js';
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { userValidationSchema } from "./utils/validationSchemas.js";

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use(loggingMiddleware);//global middleware for logging requests

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

const users: User[] = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password12czxc3'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password456dvvvvdd'
    }
];

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

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    // This is a middleware function that logs the request method and URL
    //it does not call the next so the next function will not be called and the request
    //  will not proceed to the next middleware or route handler
}, (req: Request, res: Response) => {
    res.send('Hello, World!');// This is the route handler that is not called because the previous
    // middleware does not call next()
});

//we can have a schema for validating the request body using checkSchema and userValidationSchema
app.get('/api/users', query("filter").notEmpty()
    .withMessage("Filter is required")
    .isString().withMessage("Filter must be a string")
    , query("value").notEmpty().withMessage("Value is required").isString().withMessage("Value must be a string"),
    (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { filter, value } = req.query;
        if (!filter && !value) {
            return res.status(200).json(users);
        }

        if (filter && value) {
            const filteredUsers = users.filter((user) => {
                const userValue = (user as any)[filter as string];
                return userValue && userValue.toString().toLowerCase().includes((value as string).toLowerCase());
            });
            return res.status(200).json(filteredUsers);
        }
        return res.status(200).json(users);
    });

//loggingMiddleware is applied only to this route
app.get('/api/products', loggingMiddleware, (req: Request, res: Response) => {
    return res.status(200).json(products);
});

app.get('/api/users/:userId', (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = users.find((u) => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
});

//loggingMiddleware is applied only to this route
//checkSchema is used to validate the request body against the userValidationSchema
app.post('/api/users', loggingMiddleware,
    checkSchema(userValidationSchema),
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const data = matchedData<Pick<User, "name" | "email" | "password">>(req, { locations: ['body'] });
        const newUser: User = { id: (users[users.length - 1]?.id ?? 0) + 1, ...data };
        users.push(newUser);
        return res.status(201).json({ message: "User created successfully", newUser });
    });


app.use(errorHandlingMiddleware);//global error handling middleware that is applied 
//to all routes and middleware after it is defined. 
// It catches any errors that occur in the application and sends a 500 Internal Server Error response to the client.

app.put('/api/users/:userId', findUserByUserId, (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = users.find(u => u.id === req.userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser: User = { ...user, name, email, password };
    return res.status(200).json({ message: "User updated successfully", updatedUser });
});

app.patch('/api/users/:userId', findUserByUserId, (req: Request, res: Response) => {
    let user = users.find(u => u.id === req.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    user = { ...user, ...req.body };
    return res.status(200).json({ message: "User updated successfully", updatedUser: user });
});


app.delete('/api/users/:userId', findUserByUserId, (req: Request, res: Response) => {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    users.splice(users.indexOf(user), 1);
    return res.status(200).json({ message: "User deleted successfully" });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
