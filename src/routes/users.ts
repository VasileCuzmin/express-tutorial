import { Router } from "express";
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { type User } from '../@types/types.js';
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { errorHandlingMiddleware, findUserByUserId, loggingMiddleware } from "../middlewares.js";
import { userValidationSchema } from "../utils/validationSchemas.js";
import { UserModel } from "../mongoose/schemas/user.js";

const router = Router();

export const users: User[] = [
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
    },
    {
        id: 3,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password789'
    }
];

router.get('/api/users', query("filter").notEmpty()
    .withMessage("Filter is required")
    .isString().withMessage("Filter must be a string")
    , query("value").notEmpty().withMessage("Value is required").isString().withMessage("Value must be a string"),
    (req: Request, res: Response) => {
        req.sessionStore.get(req.sessionID, (err, session) => {
            if (err) {
                console.error('Error retrieving session:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log('Session data:', session);
        });

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

router.get('/api/users/:userId', (req: Request, res: Response) => {
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
// router.post('/api/users', loggingMiddleware,
//     checkSchema(userValidationSchema),
//     (req: Request, res: Response) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const data = matchedData<Pick<User, "name" | "email" | "password">>(req, { locations: ['body'] });
//         const newUser: User = { id: (users[users.length - 1]?.id ?? 0) + 1, ...data };
//         users.push(newUser);
//         return res.status(201).json({ message: "User created successfully", newUser });
//     });

router.post('/api/users', checkSchema(userValidationSchema), async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData<Pick<User, "name" | "email" | "password">>(req, { locations: ['body'] });

    const newUser = new UserModel(data);
    try {
        const savedUser = await newUser.save();
        return res.status(201).json({ message: "User created successfully", newUser: savedUser });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create user', details: error });
    }
});


router.patch('/api/users/:userId', findUserByUserId, (req: Request, res: Response) => {
    let user = users.find(u => u.id === req.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    user = { ...user, ...req.body };
    return res.status(200).json({ message: "User updated successfully", updatedUser: user });
});


router.delete('/api/users/:userId', findUserByUserId, (req: Request, res: Response) => {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    users.splice(users.indexOf(user), 1);
    return res.status(200).json({ message: "User deleted successfully" });
});

router.put('/api/users/:userId', findUserByUserId, (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = users.find(u => u.id === req.userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser: User = { ...user, name, email, password };
    return res.status(200).json({ message: "User updated successfully", updatedUser });
});



export default router;