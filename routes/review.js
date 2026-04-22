const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../Utils/wrapAsync.js");//file required from utils folder that handles the error...
const ExpressError = require("../Utils/ExpressError.js"); //file required from utils folder to handle error....
const { listingSchema,reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Joi = require("joi");
const Listing = require("../models/listing.js");
const{validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controller/review.js");



// const validateReview = (req,res,next) => { //server side validation for reviews using Joi..............
//     let{error} = reviewSchema.validate(req.body);
//     if(error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }

// }

//putting reviews to the listings
router.post("/",
    isLoggedIn,
    validateReview,wrapAsync(ReviewController.postReview));

//dELETEING specific reviews using thier IDs................
router.delete("/:reviewId",
    isLoggedIn, 
    isReviewAuthor,
    wrapAsync(ReviewController.destroyReview));

module.exports = router