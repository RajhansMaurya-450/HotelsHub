const express = require ("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js")
const wrapAsync = require("../Utils/wrapAsync.js"); //file required from utils folder that handles the error...
const ExpressError = require("../Utils/ExpressError.js"); //file required from utils folder to handle error....
const { listingSchema,reviewSchema } = require("../schema.js");
const {isLoggedIn, isOwner} = require("../middleware.js");//reuiring middileware.js to check if the user is logged in or not......
const ListingController = require("../controller/listings.js");
const multer  = require('multer') //m
const upload = multer({ dest: 'uploads/' })
const validateListing = (req,res,next) => { //server silde validation using Joi..............
    let{error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}
//wrapAsync here & in other places of Asyn function is used that if the error occured on any route it will directed to the relevant 

router.route("/")

        .get(wrapAsync(ListingController.Index))//applying mvc logic............

        //create ROute
        // .put(isLoggedIn,wrapAsync(ListingController.createListing));

        .put( upload.single('ListingsArr[image]'),(req,res)=>{
            res.send(req.file);
        });




// Create listing route......................
//Normal route without error handling
// app.put("/listings",async(req,res)=>{
//     let newListing = new Listing(req.body.ListingsArr);
//     await newListing.save();
//     console.log(req.body.ListingsArr);
//     res.redirect("/listings");
// })

//Error handling using try-catch method..............
// app.put("/listings",async(req,res,next)=>{
//     try{
//          let newListing = new Listing(req.body.ListingsArr);
//     await newListing.save();
//     console.log(req.body.ListingsArr);
//     res.redirect("/listings");
//     }catch(err) {
//         next(err);
//     }
   
// })
//Error handling using wrapAsync method................




//edit route.......
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.editListing));

router.route("/:id")
//Update ROute................
.put( isLoggedIn, isOwner,wrapAsync(ListingController.updateListing))

//Delete ROute..............
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.deleteListing));



module.exports = router