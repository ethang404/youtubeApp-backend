const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database").sequelize;

//import User model to define a one to many relationship
const Friends = require("./Friends");

const Intrests = sequelize.define(
	"Intrests",
	{
		// Model attributes are defined here
		hobby: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		freezeTableName: true,
		// Other model options go here
	}
);

Intrests.belongsTo(Friends); // Define BelongsTo association

module.exports = Intrests;
