const { validationResult } = require("express-validator");
const createHttpError = require("http-errors");
const Category = require("../models/category.model");
const Event = require("../models/event.model");
const {
    createEventValidator,
    paramEventValidator,
    updateEventValidator,
} = require("../utils/validators/event.validator");

const eventRouter = require("express").Router();

eventRouter.get("/", (req, res, next) => {
    Event.findAll({ include: Category }).then(data => res.json(data));
});

eventRouter.get("/:id", paramEventValidator(), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return next(createHttpError(400, { errors: result.mapped() }));

    const { id } = req.params;
    Event.findOne({ where: { id }, include: Category })
        .then(data => res.json(data))
        .catch(err => next(err));
});

eventRouter.post("/", createEventValidator(), (req, res, next) => {
    if (req.user?.role !== "admin") return next(createHttpError(400, "only admin can post events"));

    const result = validationResult(req);
    if (!result.isEmpty()) return next(createHttpError(400, { errors: result.mapped() }));

    const { title, description, address, date, image } = req.body;
    const payload = { title, description, address, date, image };

    Event.create(payload)
        .then(event => {
            Category.findOne({ where: { id: req.body.categoryId } })
                .then(category =>
                    event
                        .setCategory(category)
                        .then(data => res.json(data))
                        .catch(err => next(err))
                )
                .catch(err => next(err));
        })
        .catch(err => next(err));
});

eventRouter.put("/:id", updateEventValidator(), (req, res, next) => {
    if (req.user?.role !== "admin")
        return next(createHttpError(400, "only admin can update events"));

    const result = validationResult(req);
    if (!result.isEmpty()) return next(createHttpError(400, { errors: result.mapped() }));

    const { title, description, address, date, image, categoryId } = req.body;
    const payload = { title, description, address, date, image, categoryId };

    const { id } = req.params;
    Event.update(payload, { where: { id } })
        .then(data => res.json({ message: "update successful", event: { id, ...payload } }))
        .catch(err => next(err));
});

eventRouter.delete("/:id", paramEventValidator(), (req, res, next) => {
    if (req.user?.role !== "admin")
        return next(createHttpError(400, "only admin can delete events"));

    const result = validationResult(req);
    if (!result.isEmpty()) return next(createHttpError(400, { errors: result.mapped() }));

    const { id } = req.params;

    Event.destroy({ where: { id } })
        .then(data => res.json({ message: "delete successful", event: { id } }))
        .catch(err => next(err));
});

module.exports = eventRouter;
