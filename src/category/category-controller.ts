import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Category } from "./category-types";
import { CategoryService } from "./category-service";
import { Logger } from "winston";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {
        this.create = this.create.bind(this);
        this.getOne = this.getOne.bind(this);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { name, priceConfiguration, attributes } = req.body as Category;

        // todo: call the category service
        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes,
        });

        this.logger.info(`Created category`, { id: category._id });

        res.status(201).json({ id: category._id });
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { id } = req.params;

        // todo: call the category service
        const category = await this.categoryService.getOne(id);

        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        this.logger.info(`Fetched category`, category);

        res.status(200).json(category);
    }

    async get(_req: Request, res: Response, next: NextFunction) {
        // todo: call the category service
        const category = await this.categoryService.get();

        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        this.logger.info(`Fetched categories`, category);

        res.status(200).json(category);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { name, priceConfiguration, attributes } = req.body as Category;

        const { id } = req.params;

        const category = await this.categoryService.update(id, {
            name,
            priceConfiguration,
            attributes,
        });

        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        this.logger.info(`Updated category`, category);

        res.status(200).json(category);
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        const { id } = req.params;

        // todo: call the category service
        const category = await this.categoryService.destroy(id);

        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        this.logger.info(`Destroy category`, category);

        res.status(204).json();
    }
}
