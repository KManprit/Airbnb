const User = require("../models/user");
const passport = require("passport");
const ExpressError = require('../utils/ExpressError');


module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signup = async (req, res) => {
    let { username, email, password } = req.body;
    try {
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{//jaise hi user signup kiya use loginn krwa dege req.login hai essi ke liye bna h
            if(err){
               return  next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");

        })
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to Airbnb!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect( redirectUrl);
};


module.exports.logout  = (req,res,next)=>{
    req.logOut((err)=>{//logout=>terminate the session immediately
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out successfully!");
        res.redirect("/listings");
    })
};