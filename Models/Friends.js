const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database").sequelize;

//import User model to define a one to many relationship
const User = require("./User");

const Friends = sequelize.define(
	"Friends",
	{
		// Model attributes are defined here
		firstName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		birthday: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		sex: {
			type: DataTypes.STRING(100),
		},
		age: {
			type: DataTypes.INTEGER,
		},
		personality: {
			type: DataTypes.STRING(100),
		},
		budget: {
			//refers to how much user wants to spend on this friend
			type: DataTypes.DOUBLE,
		},
		relationship: {
			type: DataTypes.STRING(100), //relationship to user
		},
		giftType: {
			type: DataTypes.STRING(100), //could be Techy/ novel etc.
		},
		giftStyle: {
			type: DataTypes.STRING(100), //thoughtful vs practical
		},
		notes: {
			type: DataTypes.STRING, //Do they value practicality? Personalized touches? Heartwarming?
		},
	},
	{
		freezeTableName: true,
		// Other model options go here
	}
);

Friends.belongsTo(User); // Define BelongsTo association

module.exports = Friends;
