const Listing = require("./models/listing");
const Review= require("./models/review");
const ExpressError = require('./utils/ExpressError');
const { listingSchema , reviewSchema} = require("./schema.js"); 
const review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.user);
   
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in to create listings , edit or delete listings ");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing ");
        return res.redirect(`/listings/${id}`);

    }
    next();
}



module.exports.validateListing = (req, res, next) => {
    console.log(req.body); // Log the request body
    // Output:
    // {
    //   title: 'My Listing',
    //   description: 'This is my listing',
    //   location: 'New York',
    //   country: 'USA',
    //   image: {
    //     filename: 'image.jpg',
    //     url: 'https://example.com/image.jpg'
    //   }
    // }
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map(el => el.message).join(",");
      res.status(400).send({ error: `Please provide a valid listing. ${errMsg}` });
    } else {
      next();
    }
  };
  module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map(el => el.message).join(",");
      res.status(400).send({ error: `Please provide a valid review. ${errMsg}` });
    } else {
      next();
    }
  };
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id, reviewId  } = req.params;
    let review = await Review.findById(reviewId );
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not Author  of this review  ");
        return res.redirect(`/listings/${id}`);

    }
    next();
};
