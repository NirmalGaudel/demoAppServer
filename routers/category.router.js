const Category = require("../models/category.model");

const categoryRouter = require("express").Router();

categoryRouter.get("/", (req, res, next) => {
    Category.findAll()
        .then(result => res.json(result))
        .catch(err => next(err));
});

module.exports = categoryRouter;
