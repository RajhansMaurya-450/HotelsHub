const express = require("express");
const wrapAsync = require("../Utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")
const UserController = require("../controller/user.js")

//using mvc logic to optimise code................

//SignUp routes..........
router.route("/signup")
.get( UserController.renderSignUpForm)
.post( wrapAsync(UserController.SignUpUser));


//login route.........................
router.route("/login")
.get( UserController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    UserController.loginUser
);

//logout route.............
router.get("/logout", UserController.logoutUser);


module.exports = router;