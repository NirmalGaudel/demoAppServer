const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const UserDetail = sequelize.define("userdetail", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    phone: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            isPhoneNumber(value) {
                if (`${value}`.length < 10) {
                    throw new Error("invalid phone number");
                }
            },
        },
    },

});

module.exports = UserDetail;
