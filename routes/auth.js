const express = require("express");
const router = express.Router();

//const { verifyToken } = require("../Controllers/FriendController");
const {
	Register,
	ClearDB,
	//RefreshAccessToken,
	Login,
} = require("../Controllers/AuthController");

const { AuthenticateToken, IsTokenValid } = require("../Controllers/MiddleWearController");

//router.get("/", VerifyToken);
router.post("/register", Register);
router.post("/login", Login);
//router.post("/refresh", RefreshAccessToken);
router.get("/validToken", IsTokenValid);

router.post("/clearDB", ClearDB);

module.exports = router;
