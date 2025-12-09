import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Filter, Product } from "./product-types";
import { FileStorage } from "../common/types/storage";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { Logger } from "winston";
import { AuthRequest } from "../common/types";
import { Roles } from "../common/constants";
import mongoose from "mongoose";

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
        private logger: Logger,
    ) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const image = req.files!.image as UploadedFile;
        const imageName = uuidv4();
        await this.storage.upload({
            fileName: imageName,
            fileData: image.data,
        });

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
            image: imageName,
        };

        // todo: add proper request body types
        const newProduct = await this.productService.create(
            product as unknown as Product,
        );
        res.json({ id: newProduct._id });
    };
    update = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { productId } = req.params;
        if (!productId) {
            return next(createHttpError(400, "Product ID is required"));
        }

        const product = await this.productService.get(productId);
        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

        if ((req as AuthRequest).auth.role != Roles.ADMIN) {
            const tenant = (req as AuthRequest).auth?.tenant;
            if (product.tenantId != String(tenant)) {
                return next(
                    createHttpError(
                        403,
                        "You are not allowed to access this product",
                    ),
                );
            }
        }

        let imageName: string | undefined;
        let oldImage: string | undefined;
        if (req.files?.image) {
            const oldImage = product.image;
            const image = req.files.image as UploadedFile;
            imageName = uuidv4();
            await this.storage.upload({
                fileName: imageName,
                fileData: image.data,
            });
            await this.storage.delete(oldImage);
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

        const productToUpdate = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            tenantId,
            categoryId,
            isPublish,
            image: imageName ? imageName : (oldImage as string),
        };

        await this.productService.update(productId, productToUpdate);
        res.json({ id: productId });
    };
    getAll = async (req: Request, res: Response) => {
        const { query, tenantId, categoryId, isPublish } = req.query;

        const filters: Filter = {};

        if (isPublish === "true") {
            filters.isPublish = true;
        }

        if (tenantId) {
            filters.tenantId = tenantId as string;
        }

        if (
            categoryId &&
            mongoose.Types.ObjectId.isValid(categoryId as string)
        ) {
            filters.categoryId = new mongoose.Types.ObjectId(
                categoryId as string,
            );
        }

        this.logger.info("Fetching products", {
            query,
            filters,
            requestedBy: req.auth?.sub || "unknown",
        });

        const products = await this.productService.getProducts(
            query as string,
            filters,
            {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit
                    ? parseInt(req.query.limit as string)
                    : 10,
            },
        );

        const finalProduct = (products.data as Product[]).map(
            (product: Product) => {
                return {
                    ...product,
                    image: this.storage.getObjectUrl(product.image),
                };
            },
        );
        this.logger.info("Products fetched successfully", {
            count: products.length,
            filtersApplied: filters,
        });
        res.json({
            data: finalProduct,
            total: products.length,
            pageSize: products.limit,
            currentPage: products.page,
        });
    };
    get = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { productId } = req.params;

        const product = await this.productService.get(productId);
        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }
        product.image = this.storage.getObjectUrl(product?.image);

        res.json(product);
    };

    destroy = async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createHttpError(400, errors.array()[0].msg as string));
        }
        const { productId } = req.params;

        const product = await this.productService.destroy(productId);

        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }
        await this.storage.delete(product?.image);

        res.status(204);
    };
}
