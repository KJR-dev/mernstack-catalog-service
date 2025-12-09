import { body, param } from "express-validator";

export const createProductValidator = [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name should be string"),
    body("description").exists().withMessage("Description is required"),
    body("priceConfiguration")
        .exists()
        .withMessage("Price configuration is required"),
    body("attributes").exists().withMessage("Attributes field is required"),
    body("tenantId").exists().withMessage("Tenant id field is required"),
    body("categoryId").exists().withMessage("Category id field is required"),
    body("image").custom((value, { req }) => {
        if (!req.files) {
            throw new Error("Product image is required");
        }
        return true;
    }),
];

export const updateProductValidator = [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name should be string"),
    body("description").exists().withMessage("Description is required"),
    body("priceConfiguration")
        .exists()
        .withMessage("Price configuration is required"),
    body("attributes").exists().withMessage("Attributes field is required"),
    body("tenantId").exists().withMessage("Tenant id field is required"),
    body("categoryId").exists().withMessage("Category id field is required"),
    body("image").custom((value, { req }) => {
        if (!req.files) {
            throw new Error("Product image is required");
        }
        return true;
    }),
];

export const idParamValidator = [
    param("productId")
        .exists()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid Product ID format"),
];
