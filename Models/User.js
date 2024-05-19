const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database").sequelize;

const User = sequelize.define(
	"User",
	{
		// Model attributes are defined here
		userName: {
			type: DataTypes.STRING, //this will be what uniquely identifies a user for login
			allowNull: false, //id still exists for database purposes
			unique: true,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		birthday: {
			type: DataTypes.DATE,
		},
		age: {
			type: DataTypes.INTEGER,
		},
		password: {
			type: DataTypes.STRING,
		},
	},
	{
		freezeTableName: true,
		// Other model options go here
	}
);

module.exports = User;
