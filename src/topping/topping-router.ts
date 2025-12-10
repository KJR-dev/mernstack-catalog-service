import express from "express";
import { asyncWrapper } from "../common/utils/wrapper";
import { ToppingController } from "./topping-controller";
import {
    createToppingValidator,
    tenantIdParamValidator,
    toppingIdParamValidator,
    updateToppingValidator,
} from "./topping-validator";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";
import { S3Storage } from "../common/services/S3Storage";
import logger from "../config/logger";
import { ToppingService } from "./topping-service";

const toppingRouter = express.Router();

const s3Storage = new S3Storage();
const toppingService = new ToppingService();
const toppingController = new ToppingController(
    toppingService,
    s3Storage,
    logger,
);

toppingRouter.post(
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
    createToppingValidator,
    asyncWrapper(toppingController.create),
);

toppingRouter.get(
    "/:tenantId",
    tenantIdParamValidator,
    asyncWrapper(toppingController.getByTenantId),
);

toppingRouter.put(
    "/:toppingId",
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
    updateToppingValidator,
    asyncWrapper(toppingController.update),
);

toppingRouter.delete(
    "/:toppingId",
    authenticate,
    toppingIdParamValidator,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    asyncWrapper(toppingController.destroy),
);

export default toppingRouter;
