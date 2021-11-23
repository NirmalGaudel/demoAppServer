function formatSequelizeValidationError(err) {
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
        const errors = {};
        err.errors.forEach(e => {
            errors[e.path] = {
                path: e.path,
                msg: e.message,
                type: e.validatorKey,
                value: e.value,
            };
        });
        return { message: "validation failed", errors, status: err.status };
    } else return err;
}

module.exports = formatSequelizeValidationError;
