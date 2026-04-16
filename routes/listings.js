const express = require ("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js")
const wrapAsync = require("../Utils/wrapAsync.js"); //file required from utils folder that handles the error...
const ExpressError = require("../Utils/ExpressError.js"); //file required from utils folder to handle error....
const { listingSchema,reviewSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");//reuiring middileware.js to check if the user is logged in or not......


//wrapAsync here & in other places of Asyn function is used that if the error occured on any route it will directed to the relevant error page.................
router.get("/",wrapAsync(async(req,res)=>{
    let hotelsData = await Listing.find();
    res.render("listing/index.ejs",{hotelsData});
    // console.log(hotelsData);
    // res.send(hotelsData);
}))



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
//create ROute
router.put("/",isLoggedIn,wrapAsync(async(req,res)=>{

    if(!req.body.ListingsArr){
        throw new ExpressError(400,"ENTER A VALID DATA FOR LISTING!");
    }
    let newListing = new Listing(req.body.ListingsArr);
    await newListing.save();
    req.flash("success","New Property added Sucessfully!");
    console.log(req.body.ListingsArr);
    res.redirect("/listings");
}));

//edit route.......
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let editHoteldata = await Listing.findById(id);
    console.log(id);
    res.render("listing/EditHotelData.ejs",{editHoteldata});

}));

//Update ROute................
router.put("/:id",wrapAsync(async(req,res)=>{

    if(!req.body.ListingsArr){
        throw new ExpressError(400,"ENTER A VALID DATA FOR LISTING!");
    }

    let {id} = req.params;
    let editHoteldata = await Listing.findByIdAndUpdate(id,req.body.ListingsArr);
    console.log(editHoteldata);
    req.flash("success","Property Details Updated!");
    res.redirect(`/listingData/${id}`);
}))

//Delete ROute..............
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
     let {id} = req.params;
    let editHoteldata = await Listing.findByIdAndDelete(id);
    console.log(editHoteldata);
    req.flash("success","Property Deleted Sucessfully!");
    res.redirect("/listings");
}))



module.exports = router