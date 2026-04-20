const Listing = require("./models/listing");
const ExpressError = require("./Utils/ExpressError.js"); //file required from utils folder to handle error....
const Review = require("./models/review.js");
const { listingSchema,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to add your property!");
        return res.redirect("/login");
    }
    next();
};

//This middleware usually checks if the user is logged in or not to make any edits to our listing page.................


module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner[0].equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing");
        return res.redirect(`/listingData/${id}`);
    }
    next();
    //owner info middelware
};

module.exports.validateReview = (req,res,next) => { //server side validation for reviews using Joi..............
    let{error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

module.exports.isReviewAuthor = async(req,res,next) => { //server side validation for reviews using Joi..............
    let{id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","you are not the author of this review");
        return res.redirect(`/listingData/${id}`);
    }
        next();
    }

