const express = require("express");
const router = express.Router({ mergeParams: true }); // Ensure mergeParams is true to access params from the parent router
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require('../utils/ExpressError');

// const { reviewSchema } = require("../schema");
const{validateReview, isLoggedIn , isReviewAuthor} = require("../middleware");
// Middleware
const reviewController = require("../controllers/reviews.js");

// Reviews - POST route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Reviews - DELETE route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
