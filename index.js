const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");

//Database setups
const sequelize = require("./config/database").sequelize;
require("./Models/User");
require("./Models/Friends");
require("./Models/Intrests");

async function init() {
	await sequelize.sync({ force: true });
}
//init();

//Route
const authRoutes = require("./routes/auth");
const friendRoutes = require("./routes/friend");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/friend", friendRoutes);

app.use(
	session({
		secret: "test",
		resave: false,
		saveUninitialized: true,
		//cookie: { secure: false },
	})
);

app.get("/test", function (req, res) {
	console.log("blah");
	console.log(req.session);
	console.log(req.session.sessionId);
	res.sendStatus(200);
});

//So I will define routes here
//The individual routes in ./routes will call controller as a callback(no paranthesis)
//Controller will use services to extract informationg from data base and return something.

//Service uses Model
//Still a bit confused on why this much abstraction, and what Model does exactly.
//--model defines schema, I can have a ./config/database.js to establish connection with mySQl + sequelize
//I will forgo Service I think and just have controller

app.listen(8000, () => {
	console.log("Server running on port 8000");
});
