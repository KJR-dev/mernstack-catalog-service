import express from "express";
import { CategoryController } from "./category-controller";
import {
    createCategoryValidator,
    idParamValidator,
    updateCategoryValidator,
} from "./category-validator";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import { asyncWrapper } from "../common/utils/wrapper";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";

const categoryRouter = express.Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

categoryRouter.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    createCategoryValidator,
    asyncWrapper(categoryController.create),
);

categoryRouter.get(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    idParamValidator,
    asyncWrapper(categoryController.getOne),
);

categoryRouter.get("/", asyncWrapper(categoryController.get));

categoryRouter.put(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    updateCategoryValidator,
    asyncWrapper(categoryController.update),
);

categoryRouter.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    idParamValidator,
    asyncWrapper(categoryController.destroy),
);

export default categoryRouter;
