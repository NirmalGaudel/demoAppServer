const { validationResult } = require("express-validator");
const createHttpError = require("http-errors");
const User = require("../models/user.model");
const { generateAuthToken } = require("../utils/jwt/jwt");
const { signinValidator, registerValidator } = require("../utils/validators/auth.validators");

const authRouter = require("express").Router();

authRouter.post("/login", signinValidator(), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return next(createHttpError(400, { errors: result.mapped() }));

    const { username, password } = req.body;
    if (!username || !password) return next(createHttpError(401, "Invalid Username or Password"));
    User.findOne({ where: { username, password } })
        .then(result => {
            if (!result) return next(createHttpError(401, "Invalid Username or Password"));
            delete result.dataValues.password;
            generateAuthToken(result)
                .then(token => res.status(202).json({ token, user: result.dataValues }))
                .catch(err => next(err));
        })
        .catch(err => next(err));
});

authRouter.post("/signup", registerValidator(), (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return next(createHttpError(400, { errors: result.mapped() }));

    const { username, email, fullname, password } = req.body;
    User.create({ username, email, fullname, password })
        .then(result => {
            delete result.dataValues.password;
            generateAuthToken(result)
                .then(token => res.status(201).json({ token, user: result.dataValues }))
                .catch(err => next(err));
        })
        .catch(err => next(createHttpError(400, err)));
});

module.exports = authRouter;
