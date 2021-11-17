const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const createHttpError = require("http-errors");

const sequilize = require("./utils/database");
const authRouter = require("./routers/auth.router");
const userRouter = require("./routers/users.router");
const tokenValidator = require("./utils/jwt/tokenValidator");
const User = require("./models/user.model");
const UserDetail = require("./models/user.details.model");
const categoryRouter = require("./routers/category.router");

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", tokenValidator, userRouter);
app.use("/category", categoryRouter);

app.use((req, res, next) => next(createHttpError(404, "not found")));

app.use((err, req, res, next) => {
    // console.log(err);
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
        const errors = [];
        err.errors.forEach(e =>
            errors.push({ path: e.path, message: e.message, type: e.validatorKey, value: e.value })
        );
        res.status(400).json({ message: "validation failed", errors });
    } else res.status(err.status || 500).json({ ...err });
});

User.hasOne(UserDetail);
sequilize
    .sync()
    .then(res => app.listen(PORT, () => console.log(`Listioning on http://localhost:${PORT}/`)));
