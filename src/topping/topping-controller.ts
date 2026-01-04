import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { v4 as uuidv4 } from "uuid";
import { Logger } from "winston";
import { MessageProducerBroker } from "../common/types/broker";
import { FileStorage } from "../common/types/storage";
import { KAFKA_TOPICS } from "../config/constants";
import { ToppingService } from "./topping-service";
import { IToppingCreateRequest } from "./topping-types";

export class ToppingController {
    constructor(
        private toppingService: ToppingService,
        private storage: FileStorage,
        private broker: MessageProducerBroker,
        private logger: Logger,
    ) {}

    create = async (
        req: Request<object, object, IToppingCreateRequest>,
        res: Response,
        next: NextFunction,
    ) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createHttpError(400, errors.array()[0].msg as string));
        }

        const { name, price, tenantId } = req.body;

        const image = req.files!.image as UploadedFile;
        const imageName = uuidv4();
        await this.storage.upload({
            fileName: imageName,
            fileData: image.data,
        });

        const topping = {
            name,
            price,
            image: imageName,
            tenantId,
        };

        const newTopping = await this.toppingService.create(topping);
        await this.broker.sendMessage(
            KAFKA_TOPICS.TOPPING,
            JSON.stringify({ id: newTopping._id, price: newTopping.price }),
        );
        res.json(newTopping);
    };

    getByTenantId = async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createHttpError(400, errors.array()[0].msg as string));
        }
        const { tenantId } = req.params;
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit
            ? parseInt(req.query.limit as string)
            : 10;
        const toppingLists = await this.toppingService.getByTenantId(tenantId, {
            page,
            limit,
        });

        const finalToppingLists = toppingLists.map((topping) => {
            return {
                id: topping._id,
                name: topping.name,
                price: topping.price,
                tenantId: topping.tenantId,
                image: this.storage.getObjectUrl(topping.image),
            };
        });
        res.json(finalToppingLists);
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createHttpError(400, errors.array()[0].msg as string));
        }

        // const { name, price, tenantId } = req.body;
        const { toppingId } = req.params;

        const topping = await this.toppingService.getByToppingId(toppingId);

        if (!topping) {
            return next(createHttpError(404, "Topping not found"));
        }

        let imageName: string | undefined;
        let oldImage: string | undefined;
        if (req.files?.image) {
            oldImage = topping.image;
            const image = req.files.image as UploadedFile;
            imageName = uuidv4();
            await this.storage.upload({
                fileName: imageName,
                fileData: image.data,
            });
            await this.storage.delete(oldImage);
        }

        const { name, price, tenantId } = req.body;

        const toppingToUpdate = {
            name,
            price,
            tenantId,
            image: imageName ? imageName : (oldImage as string),
        };

        const updateTopping = await this.toppingService.update(
            toppingId,
            toppingToUpdate,
        );
        await this.broker.sendMessage(
            KAFKA_TOPICS.TOPPING,
            JSON.stringify({
                id: updateTopping?._id,
                price: updateTopping?.price,
            }),
        );
        res.json(updateTopping);
    };

    destroy = async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(createHttpError(400, errors.array()[0].msg as string));
        }
        const { toppingId } = req.params;

        const deleted = await this.toppingService.destroy(toppingId);

        if (!deleted) {
            return next(createHttpError(404, "Topping not found"));
        }

        res.json({
            success: true,
            message: "Topping deleted successfully",
        });
    };
}
