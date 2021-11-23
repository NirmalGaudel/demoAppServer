const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Category = require("./category.model");

const Event = sequelize.define("event", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    people: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
});

module.exports = Event;
