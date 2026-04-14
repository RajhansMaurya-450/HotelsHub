const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../Utils/wrapAsync.js");//file required from utils folder that handles the error...
const ExpressError = require("../Utils/ExpressError.js"); //file required from utils folder to handle error....
const { listingSchema,reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Joi = require("joi");
const Listing = require("../models/listing.js")



const validateReview = (req,res,next) => { //server side validation for reviews using Joi..............
    let{error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

//putting reviews to the listings
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    
    let listing = await Listing.findById(req.params.id);
    let reviewData = await new Review(req.body.review);
    
    listing.reviews.push(reviewData);
   
    let res1 = await reviewData.save();
     
    let res2 = await listing.save();
     req.flash("success","Review Added Successfully!");
    res.redirect(`/listingData/${id}`);
    

}));

//dELETEING specific reviews using thier IDs................
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Sucessfully!");
     res.redirect(`/listingData/${id}`);
}));

module.exports = router