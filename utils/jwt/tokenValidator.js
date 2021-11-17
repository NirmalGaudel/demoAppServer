const createHttpError = require("http-errors");
const User = require("../../models/user.model");
const { verifyAuthToken } = require("./jwt");

function tokenValidator(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) return next(createHttpError(401, new Error("Session Expired")));
    const token = authorization.split(" ")[1]; // Bearer token
    req.user = verifyAuthToken(token)
        .then(d => {
            const { id } = d;
            
            User.findOne({ where: { id } })
                .then(data => {
                    if (!data) return next(createHttpError(401, "Invalid Token"));
                    delete data.dataValues.password;
                    req.user = data.dataValues;
                    next();
                })
                .catch(e => next(createHttpError(401, e)));
        })
        .catch(e => next(createHttpError(401, e)));
}

module.exports = tokenValidator;
