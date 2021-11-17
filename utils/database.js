const Sequelize = require("sequelize");
let sequelize;
try {
    sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
        dialect: "postgres",
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        logging: false,
    });
} catch (error) {
    console.log(error.message);
    process.exit();
}

module.exports = sequelize;
