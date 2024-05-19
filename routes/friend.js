const express = require("express");
const router = express.Router();

const { VerifyToken, IsTokenValid } = require("../Controllers/MiddleWearController");
const { friendOutput } = require("../Controllers/FriendController");

/* router.get("/", function (req, res) {
	let accessToken = req.headers["authorization"];
	let refreshToken = req.headers["x-refresh-token"];
	console.log("refreshToken: ", refreshToken);
	console.log("accessToken: ", accessToken);
	console.log("testKey: ", testKey);
	res.send("testing me");
}); */

//router.get("/testOutput", friendOutput);
router.get("/test", VerifyToken, friendOutput);
module.exports = router;
