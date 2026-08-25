export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
}

export interface Query {
    filter?: string;
    value?: string;
}