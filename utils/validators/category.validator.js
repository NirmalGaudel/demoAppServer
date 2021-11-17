const { body, param } = require("express-validator");
const Category = require("../../models/category.model");

function CategoryParamIdValidator() {
    return [
        param("id")
            .exists()
            .withMessage("Id is required")
            .isNumeric()
            .withMessage("id must be a number")
            .custom(
                id =>
                    new Promise((resolve, reject) =>
                        Category.findOne({ where: { id } })
                            .then(result => (result ? resolve() : reject("User Not Found")))
                            .catch(err => reject(err))
                    )
            ),
    ];
}

function createCategoryValidator() {
    return [
        body("title")
            .exists()
            .withMessage("title is required")
            .trim()
            .isLength({ min: 3 })
            .withMessage("title requires at least 3 characters")
            .isLength({ max: 100 })
            .withMessage("title must have less than 100 characters"),
        body("description")
            .exists()
            .withMessage("description is required")
            .trim()
            .isLength({ min: 10 })
            .withMessage("description requires at least 10 characters")
            .isLength({ max: 200 })
            .withMessage("description must have less than 200 characters"),
    ];
}

function updateCategoryValidator() {
    return [
        param("id")
            .exists()
            .withMessage("Id is required")
            .isNumeric()
            .withMessage("id must be a number")
            .custom(
                id =>
                    new Promise((resolve, reject) =>
                        Category.findOne({ where: { id } })
                            .then(result => {
                                result ? resolve() : reject("User Not Found");
                            })
                            .catch(err => reject(err))
                    )
            ),
        body("title")
            .optional()
            .trim()
            .isLength({ min: 3 })
            .withMessage("title requires at least 3 characters")
            .isLength({ max: 100 })
            .withMessage("title must have less than 100 characters"),
        body("description")
            .optional()
            .trim()
            .isLength({ min: 10 })
            .withMessage("description requires at least 10 characters")
            .isLength({ max: 200 })
            .withMessage("description must have less than 200 characters"),
    ];
}

module.exports = { CategoryParamIdValidator, createCategoryValidator, updateCategoryValidator };
