import productModel from "./product-model";
import { Product } from "./product-types";

export class ProductService {
    async create(product: Product) {
        return await productModel.create(product);
    }
    async getImage(productId: string) {
        return await productModel.findById(productId).select("image").lean();
    }
    async update(productId: string, product: Product) {
        return await productModel.findOneAndUpdate(
            {
                _id: productId,
            },
            {
                $set: product,
            },
            {
                new: true,
            },
        );
    }
}
