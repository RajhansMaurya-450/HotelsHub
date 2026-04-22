const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//post review..............
module.exports.postReview = async(req,res)=>{
    let {id} = req.params;
    
    let listing = await Listing.findById(req.params.id);
    let reviewData = await new Review(req.body.review);
    reviewData.author = req.user._id;
    console.log(reviewData);
    
    listing.reviews.push(reviewData);
   
    let res1 = await reviewData.save();
     
    let res2 = await listing.save();
     req.flash("success","Review Added Successfully!");
    res.redirect(`/listingData/${id}`);
    

}

//delete review..............
module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Sucessfully!");
     res.redirect(`/listingData/${id}`);
}