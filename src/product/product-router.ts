import { Router } from "express";
import { asyncWrapper } from "../common/utils/wrapper";
import { ProductController } from "./product-controller";
import logger from "../config/logger";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import createProductValidator from "./create-product-validator";
import { ProductService } from "./product-service";
import fileUpload from "express-fileupload";

const productRouter = Router();

const productService = new ProductService();
const productController = new ProductController(productService, logger);

productRouter.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload(),
    createProductValidator,
    asyncWrapper(productController.create),
);

export default productRouter;
