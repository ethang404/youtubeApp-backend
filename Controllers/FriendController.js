function friendOutput(req, res) {
	let accessToken = req.headers["authorization"];
	let refreshToken = req.headers["x-refresh-token"];

	console.log("access(friendOutput): ", accessToken);
	console.log("refresh(friendOutput): ", refreshToken);
	return res.status(200).send({ message: "Testing my friendOutput" });
}

module.exports = { friendOutput };
