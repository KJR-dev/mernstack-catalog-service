import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import categoryRouter from "./category/category-router";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import productRouter from "./product/product-router";
import toppingRouter from "./topping/topping-router";

const app = express();
const ALLOWED_DOMAINS = [
    config.get("frontend.clientUI"),
    config.get("frontend.adminUI"),
];
app.use(
    cors({
        origin: ALLOWED_DOMAINS as string[],
    }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello from catalog service!" });
});

app.use("/api/v1/catalog/categories", categoryRouter);
app.use("/api/v1/catalog/products", productRouter);
app.use("/api/v1/catalog/topping", toppingRouter);
app.use(globalErrorHandler);

export default app;
