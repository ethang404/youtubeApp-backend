const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const ACCESS_TOKEN_TIME = "15s";

async function VerifyToken(req, res, next) {
	//This function will take an accessToken and see if it's valid(and present)
	try {
		let accessToken = req.headers["authorization"];
		let refreshToken = req.headers["X-Refresh-Token"];

		if (!accessToken) return res.status(401).send("Access Token is required");

		jwt.verify(accessToken, process.env.TOKEN_SECRET, function (err, user) {
			if (err) {
				jwt.verify(refreshToken, process.env.TOKEN_SECRET, function (err, user) {
					if (err) throw "Failed to decode refreshToken";
					RefreshAccessToken(user.id, req, res);
				});
			}
			//refreshAccessToken here
			//return res.status(403).send("Database creation of new user failed");
		});
		next();
	} catch (err) {
		return res.status(500).send({ message: "Failed to validate token" });
	}
}

async function IsTokenValid(req, res) {
	try {
		let accessToken = req.headers["authorization"];
		let refreshToken = req.headers["X-Refresh-Token"];

		if (!accessToken) return res.status(401).send("Access Token is required");

		jwt.verify(accessToken, process.env.TOKEN_SECRET, function (err, user) {
			if (err) {
				return res.status(500).send({ message: "Failed to validate token" });
			}
			//refreshAccessToken here
			//return res.status(403).send("Database creation of new user failed");
		});
		return res.status(200).send({ message: "AccessToken is Valid" });
	} catch (err) {
		return res.status(500).send({ message: "Failed to validate token" });
	}
}

/*function VerifyToken(req, res, next) {
	//This function will take an accessToken and see if it's valid(and present)
	try {
		let accessToken = req.headers["authorization"];

		if (!accessToken) return res.status(401).send("Access Token is required");

		jwt.verify(accessToken, process.env.TOKEN_SECRET, function (err, user) {
			if (err) RefreshAccessToken(req.id, req, res, next);
			//refreshAccessToken here
			//return res.status(403).send("Database creation of new user failed");
		});
	} catch (err) {
		return res.status(500).send({ message: "Failed to validate token" });
	}
}*/

function RefreshAccessToken(id, req, res) {
	try {
		//sign w/ userId and return new accessToken
		let time = ACCESS_TOKEN_TIME;
		const accessToken = GenerateToken(id, time);
		return res.status(200).send({ message: "Refreshed Access Token", accessToken });
	} catch (error) {
		console.log("Failed to refresh AccessToken: ", error);
		throw error;
		//return res.status(500).send({ message: "Failed to refresh token" });
	}
}

//store refreshToken in database table, and accessToken on frontend

//can use jwt.sign for access and refresh..basically if accessToken is invalid decode refresh for a new access.
//jwt.verify returns the payload I signed it with
/*function RefreshAccessToken(req, res, next) {
	let refreshToken = req.headers["authorization"];
	refreshToken = refreshToken.split(" ")[1];
	//req.headers["authorization"] = refreshToken;

	try {
		//decode sent refreshToken to obtain userId
		console.log(refreshToken);
		let user = jwt.decode(refreshToken, process.env.TOKEN_SECRET);
		let id = user.id;
		console.log("my user: ", user);
		console.log(id);

		//sign w/ userId and return new accessToken
		let time = ACCESS_TOKEN_TIME;
		const accessToken = GenerateToken(id, time);
		return res.status(200).send({ message: "Refreshed Access Token", accessToken });
	} catch (error) {
		console.log("Issue decoding RefreshToken: ", error);
		return res.status(500).send({ message: "Failed to refresh token" });
	}
}*/

async function Login(req, res) {
	//Take in username and password to authenticate user.
	//if valid, return an accessToken and refreshToken
	let userName = req.body.userName;
	let password = req.body.password;
	try {
		const user = await User.findOne({
			where: { userName, password },
		});

		if (user) {
			console.log("User ID:", user.id);
			console.log("Username:", user.userName);
			console.log("Email:", user.email);

			//sign w/ userId and return new accessToken
			let time = ACCESS_TOKEN_TIME;
			const accessToken = GenerateToken(user.id, time);
			const refreshToken = GenerateToken(user.id);
			return res.status(200).send({ message: "Found User", accessToken, refreshToken });
		}
	} catch (error) {
		console.error("Error finding user:", error);
		return res.status(500).send({ message: "Failed to find user with those credentials" });
	}
}

async function Register(req, res) {
	try {
		console.log("req: ", req.body);
		let userName = req.body.userName;
		let firstName = req.body.firstName;
		let lastName = req.body.lastName;
		let password = req.body.password; //these 3 are required

		let birthday = req.body.birthday;
		let age = req.body.age;
		const newUser = await User.create({ userName, firstName, lastName, password, birthday, age });
		let time = "15s";
		//const accessToken = GenerateToken(newUser.id, time);
		let id = newUser.id;
		const accessToken = jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: time }); //idk why I can't call generateToken here
		const refreshToken = jwt.sign({ id }, process.env.TOKEN_SECRET);
		return res.status(201).send({ message: "Created new user", accessToken, refreshToken });
	} catch (error) {
		console.log(error);
		return res.status(500).send("Database creation of new user failed");
	}
}

function GenerateToken(id, time) {
	if (time) return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: time }); //30 mins
	return jwt.sign({ id }, process.env.TOKEN_SECRET);
}

async function ClearDB(req, res) {
	await User.destroy({
		where: {
			firstName: "Ethan",
		},
	});
	return res.status(200).send({ message: "Deleted uiser" });
	//User.truncate(); //this should empty table
}

module.exports = { VerifyToken, Register, ClearDB, /*RefreshAccessToken,*/ Login, IsTokenValid };
