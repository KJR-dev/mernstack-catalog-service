import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const priceConfigItemSchema = new Schema(
    {
        priceType: {
            type: String,
            enum: ["base", "additional"], // VALIDATION
            required: true,
        },
        availableOptions: {
            type: Map,
            of: Number,
            required: true,
        },
    },
    { _id: false },
);

const productSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },

        description: { type: String, trim: true },

        image: { type: String, required: true },

        priceConfiguration: {
            type: Map, // dynamic keys (Size, Crust etc.)
            of: priceConfigItemSchema, // strict validation for each entry
            required: true,
        },

        attributes: [
            {
                name: { type: String, required: true },
                value: { type: Schema.Types.Mixed, required: true },
            },
        ],

        tenantId: { type: Number, required: true },

        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        isPublish: { type: Boolean, default: false },
    },
    { timestamps: true },
);
productSchema.plugin(aggregatePaginate);
export default mongoose.model("Product", productSchema);
