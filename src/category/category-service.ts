import CategoryModel from "./category-model";
import { Category } from "./category-types";

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CategoryModel(category);
        return newCategory.save();
    }

    async getOne(id: string) {
        return await CategoryModel.findById(id);
    }

    async get() {
        return await CategoryModel.find();
    }

    async update(id: string, category: Category) {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            id,
            category,
            { new: true, runValidators: true },
        );
        return updatedCategory;
    }

    async destroy(id: string) {
        return await CategoryModel.findByIdAndDelete(id);
    }
}
