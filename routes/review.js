const express = require ("express");
const router= express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//POST Route
router.post("/", isLoggedIn, validateReview, wrapAsync (reviewController.createReview));

//DELETE Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;