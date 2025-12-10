import { Request } from "express";

export interface Topping {
    name: string;
    price: number;
    image: string;
    tenantId: string;
}

export interface IToppingCreateRequest extends Request {
    name: string;
    price: number;
    image: string;
    tenantId: string;
}
