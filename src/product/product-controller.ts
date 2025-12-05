import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { ProductService } from "./product-service";
import { Product } from "./product-types";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
    ) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        // eslint-disable-next-line no-console
        console.log("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥", req);
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublish,
        } = req.body;

        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            tenantId,
            categoryId,
            isPublish,
            image: "image.jpg",
        };

        // todo: add proper request body types
        const newProduct = await this.productService.create(
            product as unknown as Product,
        );
        res.json({ id: newProduct._id });
    };
}
