const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");
//combining signup and singup
router.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync(userController.signup));


//combining login and login
router.route("/login")
.get( userController.renderLoginForm)
.post( saveRedirectUrl ,passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), userController.login);

// Signup page route
// router.get("/signup", userController.renderSignupForm);

// Signup form submission route
// router.post("/signup", wrapAsync(userController.signup));

// Login page route
// router.get("/login", userController.renderLoginForm);

// Login form submission route
// router.post("/login", saveRedirectUrl ,passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true
// }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;
