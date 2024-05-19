const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_TIME = "15s";

async function VerifyToken(req, res, next) {
	//This function will take an accessToken and see if it's valid(and present)
	try {
		let accessToken = req.headers["authorization"];
		let refreshToken = req.headers["x-refresh-token"];

		if (!accessToken) return res.status(401).send("Access Token is required");

		console.log("AccessToken: ", accessToken);
		console.log("RefreshToken: ", refreshToken);

		jwt.verify(accessToken, process.env.TOKEN_SECRET, function (err, user) {
			if (err) {
				jwt.verify(refreshToken, process.env.TOKEN_SECRET, function (err, user) {
					if (err) throw "Failed to decode refreshToken";
					accessToken = RefreshAccessToken(user.id, req, res);
				});
			}

			//refreshAccessToken here
			//return res.status(403).send("Database creation of new user failed");
		});
		req.headers["authorization"] = accessToken;
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

function RefreshAccessToken(id, req, res) {
	console.log("trying to refresh access token");
	try {
		//sign w/ userId and return new accessToken
		let time = ACCESS_TOKEN_TIME;
		const accessToken = GenerateToken(id, time);
		console.log("new accessToken refreshed is: ", accessToken);
		return accessToken;
	} catch (error) {
		console.log("Failed to refresh AccessToken: ", error);
		throw error;
		//return res.status(500).send({ message: "Failed to refresh token" });
	}
}

function GenerateToken(id, time) {
	return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: time }); //30 mins
}

module.exports = { VerifyToken, IsTokenValid };
