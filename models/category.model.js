const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Event = require("./event.model");

const Category = sequelize.define("category", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});



module.exports = Category;
