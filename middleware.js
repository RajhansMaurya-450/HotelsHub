module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.flash("error","You must be logged in to add your property!");
        return res.redirect("/login");
    }
    next();
};





//This middleware usually checks if the user is logged in or not to make any edits to our listing page.................