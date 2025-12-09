import { paginationLabels } from "../config/pagination";
import productModel from "./product-model";
import { Filter, PaginateQuery, Product } from "./product-types";

export class ProductService {
    async create(product: Product) {
        return (await productModel.create(product)) as Product;
    }

    async update(productId: string, product: Product) {
        return (await productModel.findOneAndUpdate(
            {
                _id: productId,
            },
            {
                $set: product,
            },
            {
                new: true,
            },
        )) as Product;
    }

    async get(productId: string): Promise<Product | null> {
        return await productModel.findOne({ _id: productId });
    }

    async getProducts(
        query: string,
        filters: Filter,
        paginateQuery: PaginateQuery,
    ) {
        const searchQueryRegexp = new RegExp(query, "i");
        const matchQuery = {
            ...filters,
            name: searchQueryRegexp,
        };
        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
        ]);
        return productModel.aggregatePaginate(aggregate, {
            ...paginateQuery,
            customLabels: paginationLabels,
        });
        // const result = await aggregate.exec();
        // return result as Product[];
    }

    async destroy(productId: string): Promise<Product | null> {
        return await productModel.findByIdAndDelete(productId);
    }
}
