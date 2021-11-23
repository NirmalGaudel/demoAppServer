const express = require("express");
require("dotenv").config();
const cors = require("cors");
const createHttpError = require("http-errors");

const sequelize = require("./utils/database");
const authRouter = require("./routers/auth.router");
const userRouter = require("./routers/users.router");
const tokenValidator = require("./utils/jwt/tokenValidator");
const User = require("./models/user.model");
const UserDetail = require("./models/user.details.model");
const categoryRouter = require("./routers/category.router");
const formatSequelizeValidationError = require("./utils/formaters/error.formater");
const eventRouter = require("./routers/event.router");
const Event = require("./models/event.model");
const Category = require("./models/category.model");

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json({limit:"50mb"}));

app.use("/auth", authRouter);
app.use("/users", tokenValidator, userRouter);
app.use("/category", tokenValidator, categoryRouter);
app.use("/events", tokenValidator, eventRouter);

app.use((req, res, next) => next(createHttpError(404, "not found")));

app.use((err, req, res, next) => {
    console.log(err);
    err = formatSequelizeValidationError(err);
    res.status(err.status || 500).json({ ...err });
});

User.hasOne(UserDetail);
Event.belongsTo(Category);
sequelize.sync().then(res =>
    app.listen(PORT, () => {
        console.log(`Listioning on http://localhost:${PORT}/`);
    })
);
