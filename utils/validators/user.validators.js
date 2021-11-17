const { body } = require("express-validator");
const User = require("../../models/user.model");

function updateUserValidator() {
    return [
        body("username")
            .optional()
            .trim()
            .isLength({ min: 2 })
            .withMessage("username must have at least 2 characters")
            .isLength({ max: 20 })
            .withMessage("username must have at most 20 characters")
            .custom(username => {
                return new Promise((resolve, reject) => {
                    User.findOne({ where: { username } })
                        .then(user => (user ? reject("username already exists") : resolve()))
                        .catch(e => reject(e));
                });
            }),
        body("fullname")
            .optional()
            .trim()
            .isLength({ min: 6 })
            .withMessage("short fullname")
            .custom(fullname => {
                return new Promise((resolve, reject) => {
                    if (/\d/.test(fullname)) return reject("fullname has numbers");
                    const fullname_split_len = fullname.split(" ").isLength;
                    if (fullname_split_len > 3 || fullname_split_len < 2)
                        return reject("fullname is not valid");
                    else return resolve();
                });
            }),
        body("email")
            .optional()
            .isEmail()
            .withMessage("email is not valid")
            .custom((email, { req }) => {
                return new Promise((resolve, reject) => {
                    User.findOne({ where: { email } })
                        .then(user => {
                            if (!user) return resolve();
                            else if (Number.parseInt(req.params.id.trim()) === user.id)
                                return resolve();
                            else return reject("email already exists");
                        })
                        .catch(e => reject(e));
                });
            }),
    ];
}

module.exports = { updateUserValidator };
