const Listing = require("../models/listing.js");
const ExpressError = require("../Utils/ExpressError.js"); //file required from utils folder to handle error....
const { isLoggedIn, isOwner } = require("../middleware.js");



module.exports.Index = async (req, res) => { //mvcc logic for Index route................
    let hotelsData = await Listing.find();
    res.render("listing/index.ejs", { hotelsData });
    // console.log(hotelsData);
    // res.send(hotelsData);
}

//add new listing form................
module.exports.rendernewForm = (req, res) => {

    res.render("listing/AddnewHotel.ejs");
}

//show route.............
module.exports.showlisting = async (req, res) => {
    let { id } = req.params;
    let singleData = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");
    console.log(singleData);
    if (!singleData) {
        req.flash("error", "The Item Your have requested does not exist or deleted!");
        res.redirect("/listings");
    }
    else {
        res.render("listing/show.ejs", { singleData });
    }

}

//create listing route..........
module.exports.createListing = async (req, res) => {

    // if(!req.body.ListingsArr){
    //     throw new ExpressError(400,"ENTER A VALID DATA FOR LISTING!");
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url + ".." + filename);
    let newListing = new Listing(req.body.ListingsArr);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Property added Sucessfully!");
    console.log(req.body.ListingsArr);
    res.redirect("/listings");
}

//edit route................
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let editHoteldata = await Listing.findById(id);
    if(!editHoteldata) {
        req.flash("error", "Listing you requested does not exist ");
        res.redirect("/listing");
    }
    
    let originalImageUrl = editHoteldata.image.url;
   originalImageUrl = originalImageUrl.replace("/upload","/upload/h_100,w_100");
    res.render("listing/EditHotelData.ejs", { editHoteldata, originalImageUrl });

}

//updateRoute..............
module.exports.updateListing = async (req, res) => {

    // if (!req.body.ListingsArr) {
    //     throw new ExpressError(400, "ENTER A VALID DATA FOR LISTING!");
    // }

    let { id } = req.params;
    let editHoteldata = await Listing.findByIdAndUpdate(id, { ...req.body.ListingsArr });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(editHoteldata);
        editHoteldata.image = {url,filename};
        console.log(editHoteldata);
        await editHoteldata.save();

    }
    req.flash("success", "Property Details Updated!");
    res.redirect(`/listingData/${id}`);

}


//delete ROute................
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let editHoteldata = await Listing.findByIdAndDelete(id);
    console.log(editHoteldata);
    req.flash("success", "Property Deleted Sucessfully!");
    res.redirect("/listings");
}