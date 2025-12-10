import { PaginateQuery } from "../product/product-types";
import toppingModel from "./topping-model";
import { Topping } from "./topping-types";

export class ToppingService {
    async create(topping: Topping) {
        return await toppingModel.create(topping);
    }

    async getByTenantId(tenantId: string, paginateQuery: PaginateQuery) {
        const { page, limit } = paginateQuery;
        const skip = (page - 1) * limit;

        return await toppingModel.find({ tenantId }).skip(skip).limit(limit);
    }

    async getByToppingId(toppingId: string) {
        return await toppingModel.findById(toppingId);
    }

    async update(toppingId: string, topping: Topping) {
        return await toppingModel.findOneAndUpdate(
            {
                _id: toppingId,
            },
            {
                $set: topping,
            },
            {
                new: true,
            },
        );
    }

    async destroy(toppingId: string) {
        return await toppingModel.findByIdAndDelete(toppingId);
    }
}
