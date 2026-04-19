const Listing = require("./models/listing");

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