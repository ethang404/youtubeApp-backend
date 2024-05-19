const { Sequelize } = require("sequelize");
require("dotenv").config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

// Connection parameters
const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
	host: PGHOST,
	sslmode: "require",
	dialect:
		"postgres" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
	dialectOptions: {
		ssl: {
			require: true,
		},
	},
});

async function TestDatabaseConnection() {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
}

TestDatabaseConnection();

module.exports = { sequelize };
