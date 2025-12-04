import { Router } from "express";
import { asyncWrapper } from "../common/utils/wrapper";
import { ProductController } from "./product-controller";
import logger from "../config/logger";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import createProductValidator from "./create-product-validator";

const productRouter = Router();

const productController = new ProductController(logger);

productRouter.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    createProductValidator,
    asyncWrapper(productController.create),
);

export default productRouter;
