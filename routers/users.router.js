const { validationResult } = require("express-validator");
const createHttpError = require("http-errors");
const User = require("../models/user.model");
const { updateUserValidator } = require("../utils/validators/user.validators");

const userRouter = require("express").Router();

userRouter.get("/", (req, res, next) => {
    User.findAll()
        .then(result => {
            for (user of result) delete user.dataValues.password;
            res.send(result);
        })
        .catch(err => next(createHttpError(400, err)));
});

userRouter.get("/profile", (req, res, next) => {
    res.send(req.user);
});

userRouter.get("/:id", (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    if (!id) return next(createHttpError(400, "Invalid id"));

    User.findOne({ where: { id } })
        .then(result => {
            if (!result) return next(createHttpError(404, "User Not Found"));
            delete result.dataValues.password;
            res.send(result);
        })
        .catch(err => next(createHttpError(404, err)));
});

userRouter.put("/:id", updateUserValidator(), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return next(createHttpError(400, { errors: result.mapped() }));

    const id = Number.parseInt(req.params.id);
    if (!id) return next(createHttpError(400, "Invalid id"));

    const { username, fullname, email } = req.body;

    if (req.user.role === "admin" || req.user.id === id)
        User.update({ username, fullname, email }, { where: { id } })
            .then(result => res.status(202).json({ id, username, fullname, email }))
            .catch(err => next(createHttpError(400, err)));
    else return next(createHttpError(400, "Operation Not Available"));
});

userRouter.delete("/:id", (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    if (!id) return next(createHttpError(400, "Invalid id"));

    if (req.user.role === "admin" || req.user.id === id)
        User.destroy({ where: { id } })
            .then(result => res.status(202).json(result))
            .catch(err => next(createHttpError(400, err)));
    else return next(createHttpError(400, "Operation Not Available"));
});

userRouter.post("/:id/changeRole", (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    if (!id) return next(createHttpError(400, "Invalid id"));

    if (req.user.role !== "admin") return next(createHttpError(400, "Operation Not Available"));

    if (req.user.id === id) return next(createHttpError(400, "Cannot change own role"));

    const roles = ["basic", "admin"];
    const { role } = req.body;
    if (!roles.includes(role)) return next(createHttpError(400, "Invalid role"));

    User.update({ role }, { where: { id } })
        .then(result => res.status(202).json({ id, role }))
        .catch(err => next(createHttpError(400, err)));
});

module.exports = userRouter;
