const { body } = require("express-validator");
const User = require("../../models/user.model");

function signinValidator() {
    return [
        body("username").exists().withMessage("username is required").trim(),
        body("password").exists().withMessage("password is required"),
    ];
}

function registerValidator() {
    return [
        body("username")
            .exists()
            .withMessage("username is required")
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
            .exists()
            .withMessage("fullname is required")
            .trim()
            .custom(fullname => {
                return new Promise((resolve, reject) => {
                    if (/\d/.test(fullname)) return reject("fullname has numbers");
                    fullname_split_len = fullname.split(" ").length;
                    if (fullname_split_len > 3 || fullname_split_len < 2)
                        return reject("fullname is not formated correctly");
                    else return resolve();
                });
            }),
        body("email")
            .optional()
            .isEmail()
            .withMessage("email is not valid")
            .trim()
            .custom(email => {
                return new Promise((resolve, reject) => {
                    User.findOne({ where: { email } })
                        .then(user => (user ? reject("email already exists") : resolve()))
                        .catch(e => reject(e));
                });
            })
            .withMessage("email already exists"),
        body("password")
            .exists()
            .withMessage("password is required")
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
            .withMessage("password constrains didn't match"),
    ];
}

module.exports = { signinValidator, registerValidator };
