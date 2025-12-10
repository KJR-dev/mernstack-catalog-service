import { body, param } from "express-validator";

export const createToppingValidator = [
    body("name")
        .exists()
        .withMessage("Topping name is required")
        .isString()
        .withMessage("Topping name should be string"),
    body("price")
        .exists()
        .withMessage("Topping price is required")
        .isNumeric()
        .withMessage("Topping price should be number"),
    body("image").custom((value, { req }) => {
        if (!req.files) {
            throw new Error("Topping image is required");
        }
        return true;
    }),
    body("tenantId")
        .exists()
        .withMessage("Topping Id is required")
        .isString()
        .withMessage("Topping Id should be string"),
];

export const tenantIdParamValidator = [
    param("tenantId")
        .exists()
        .withMessage("Tenant Id is required")
        .isNumeric()
        .withMessage("Invalid Tenant Id"),
];

export const updateToppingValidator = [
    param("toppingId")
        .exists()
        .withMessage("Topping Id is required")
        .isString()
        .withMessage("Topping Id should be string"),
    body("name")
        .exists()
        .withMessage("Topping name is required")
        .isString()
        .withMessage("Topping name should be string"),
    body("price")
        .exists()
        .withMessage("Topping price is required")
        .isNumeric()
        .withMessage("Topping price should be number"),
    body("image").custom((value, { req }) => {
        if (!req.files) {
            throw new Error("Topping image is required");
        }
        return true;
    }),
    body("tenantId")
        .exists()
        .withMessage("Topping Id is required")
        .isString()
        .withMessage("Topping Id should be string"),
];

export const toppingIdParamValidator = [
    param("toppingId")
        .exists()
        .withMessage("Topping Id is required")
        .isMongoId()
        .withMessage("Invalid Topping Id"),
];
