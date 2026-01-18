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

export enum ToppingEvents {
    TOPPING_CREATE = "TOPPING_CREATE",
    TOPPING_UPDATE = "TOPPING_UPDATE",
    TOPPING_DELETE = "TOPPING_DELETE",
}
