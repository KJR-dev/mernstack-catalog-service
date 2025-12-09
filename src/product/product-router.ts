import { Router } from "express";
import { asyncWrapper } from "../common/utils/wrapper";
import { ProductController } from "./product-controller";
import logger from "../config/logger";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import { createProductValidator, idParamValidator } from "./product-validator";
import { ProductService } from "./product-service";
import fileUpload from "express-fileupload";
import { S3Storage } from "../common/services/S3Storage";
import createHttpError from "http-errors";

const productRouter = Router();

const productService = new ProductService();
const s3Storage = new S3Storage();
const productController = new ProductController(
    productService,
    s3Storage,
    logger,
);

productRouter.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeds the limit");
            next(error);
        },
    }),
    createProductValidator,
    asyncWrapper(productController.create),
);

productRouter.put(
    "/:productId",
    authenticate,
    fileUpload({
        limits: { fileSize: 500 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeds the limit");
            next(error);
        },
    }),
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    asyncWrapper(productController.update),
);

productRouter.get("/", asyncWrapper(productController.getAll));

productRouter.get(
    "/:productId",
    idParamValidator,
    asyncWrapper(productController.get),
);

productRouter.delete(
    "/:productId",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    idParamValidator,
    asyncWrapper(productController.destroy),
);

export default productRouter;
