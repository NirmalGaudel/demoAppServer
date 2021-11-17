const jwt = require("jsonwebtoken");
const secret = process.env.JWTSECRET;
if (!secret) {
    console.error("No Secret Key for JWT");
    process.exit();
}

function generateAuthToken(UserDetails) {
    return new Promise((resolve, reject) => {
        const { id } = UserDetails;
        jwt.sign({ id }, secret, { expiresIn: "7d" }, (err, token) =>
            err ? reject(err) : resolve(token)
        );
    });
}

function verifyAuthToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => (err ? reject(err) : resolve(data)));
    });
}

module.exports = { generateAuthToken, verifyAuthToken };
