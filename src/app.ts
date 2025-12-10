import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/category-router";
import cookieParser from "cookie-parser";
import productRouter from "./product/product-router";
import toppingRouter from "./topping/topping-router";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello from catalog service!" });
});

app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/topping", toppingRouter);
app.use(globalErrorHandler);

export default app;
