if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}//production me nh hai to access ho rha hai

// console.log(process.env.SECRET) // remove this after you've confirmed it is working


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require('./utils/ExpressError');

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
//Authorization,Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/Airbnb";
mongoose.connect(MONGO_URL, { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to DB");
    })
    .catch(err => {
        console.error("DB connection error:", err);
    });


// Middleware
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

// Session options
const sessionOptions = {
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

// Use session and flash middleware
app.use(session(sessionOptions));
app.use(flash());//middleware for flash

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// Routes
app.get("/", (req, res) => {
    res.send("Hi, I am the root route");
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"abcd@gmail.com",
//         username:"Manprit Kaur "
//     });
//                   //user     //password
//    let registeredUser=await  User.register(fakeUser,"helloworld");
//    res.send(registeredUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// Handle all other routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});



// Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error", { message });
});

// Start server
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

