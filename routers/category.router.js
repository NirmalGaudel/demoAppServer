const { validationResult } = require("express-validator");
const createHttpError = require("http-errors");
const Category = require("../models/category.model");
const {
    createCategoryValidator,
    updateCategoryValidator,
    CategoryParamIdValidator,
} = require("../utils/validators/category.validator");

const categoryRouter = require("express").Router();

function checkAdmin(req, res, next) {
    if (req.user.role !== "admin") next(createHttpError(400, "Operation Not allowed"));
    else next();
}

categoryRouter.get("/", (req, res, next) => {
    Category.findAll()
        .then(result => res.json(result))
        .catch(err => next(err));
});
categoryRouter.get("/:id", CategoryParamIdValidator(), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return next(createHttpError(400, { errors: result.mapped() }));
    const { id } = req.params;
    Category.findOne({ where: { id } })
        .then(result => res.json(result))
        .catch(err => next(err));
});

categoryRouter.post("/", checkAdmin, createCategoryValidator(), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return next(createHttpError(400, { errors: result.mapped() }));
    Category.create(req.body)
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => next(createHttpError(400, err)));
});

categoryRouter.put("/:id", checkAdmin, updateCategoryValidator(), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return next(createHttpError(400, { errors: result.mapped() }));

    const { id } = req.params;

    Category.update(req.body, { where: { id } })
        .then(result => {
            res.json({ ...req.body, id });
        })
        .catch(err => next(createHttpError(400, err)));
});

categoryRouter.delete("/:id", checkAdmin, CategoryParamIdValidator(), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return next(createHttpError(400, { errors: result.mapped() }));

    const { id } = req.params;

    Category.destroy({ where: { id } })
        .then(result => {
            res.json(result);
        })
        .catch(err => next(createHttpError(400, err)));
});

module.exports = categoryRouter;
