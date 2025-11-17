import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/catgory-router";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello from catalog service!" });
});

app.use("/categories", categoryRouter);

app.use(globalErrorHandler);

export default app;
