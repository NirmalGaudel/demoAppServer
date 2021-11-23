const { body, param } = require("express-validator");
const Category = require("../../models/category.model");
const Event = require("../../models/event.model");

function paramEventValidator() {
    return param("id")
        .exists()
        .withMessage("id is not valid")
        .trim()
        .isNumeric()
        .isNumeric("id must be numeric")
        .custom(
            id =>
                new Promise((resolve, reject) => {
                    Event.findOne({ where: { id } })
                        .then(data => (data ? resolve() : reject("id is not valid")))
                        .catch(err => reject(err));
                })
        )
        .customSanitizer(id_string => Number.parseInt(id_string));
}

function createEventValidator() {
    return [
        body("title")
            .exists()
            .withMessage("title is required")
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage("title must have 3 to 50 characters"),
        body("description")
            .exists()
            .withMessage("description is required")
            .trim()
            .isLength({ min: 10, max: 200 })
            .withMessage("description must have 10 to 200 characters"),
        body("address")
            .exists()
            .withMessage("address is required")
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage("address must have 3 to 50 characters"),
        body("date")
            .exists()
            .withMessage("date is required")
            .trim()
            .isDate({ format: "MM/DD/YYYY" })
            .withMessage("Date is not valid"),
        body("categoryId")
            .exists()
            .withMessage("category is required")
            .isNumeric()
            .withMessage("category id must be Integer")
            .custom(
                id =>
                    new Promise((resolve, reject) =>
                        Category.findOne({ where: { id } })
                            .then(data => (data ? resolve() : reject("invalid category")))
                            .catch(err => {
                                console.log("Nirmal");
                                reject(err);
                            })
                    )
            ),
    ];
}
function updateEventValidator() {
    return [
        paramEventValidator(),
        body("title")
            .optional()
            
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage("title must have 3 to 50 characters"),
        body("description")
            .optional()
            .trim()
            .isLength({ min: 10, max: 200 })
            .withMessage("description must have 10 to 200 characters"),
        body("address")
            .optional()
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage("address must have 3 to 50 characters"),
        body("date")
            .optional()
            .trim()
            .isDate({ format: "MM/DD/YYYY" })
            .withMessage("Date is not valid"),
        body("categoryId")
            .optional()
            .isNumeric()
            .withMessage("category id must be Integer")
            .custom(
                id =>
                    new Promise((resolve, reject) =>
                        Category.findOne({ where: { id } })
                            .then(data => (data ? resolve() : reject("invalid category")))
                            .catch(err => {
                                console.log("Nirmal");
                                reject(err);
                            })
                    )
            ),
    ];
}
module.exports = { paramEventValidator, createEventValidator, updateEventValidator };
