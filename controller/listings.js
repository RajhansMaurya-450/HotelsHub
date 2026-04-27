const Listing = require("../models/listing.js");
const ExpressError = require("../Utils/ExpressError.js"); //file required from utils folder to handle error....
const { isLoggedIn, isOwner } = require("../middleware.js");
const axios = require("axios");
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;


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
    
    if (!singleData) {
        req.flash("error", "The Item Your have requested does not exist or deleted!");
        res.redirect("/listings");
    }
    else {
        res.render("listing/show.ejs", { singleData });
    }

}

//create listing route..........

async function getCoordinates(location, country) {
    // combine both for better accuracy
    const fullLocation = `${location}, ${country}`;

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(fullLocation)}&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await axios.get(url); //to fetch data from url........
    const features = response.data.features;

    if (!features || features.length === 0) {
        throw new Error("Location not found");
    }

    return features[0].geometry.coordinates; // [lng, lat]
}
 module.exports.createListing = async (req, res) => {
    
    // if(!req.body.ListingsArr){
    //     throw new ExpressError(400,"ENTER A VALID DATA FOR LISTING!");
    // }
    let url = req.file.path;
    let filename = req.file.filename;
   
    // 📍 1. Extract location + country
    const { location, country } = req.body.ListingsArr;

    // 📍 2. Convert to coordinates
    const coordinates = await getCoordinates(location, country);
    
    let newListing = new Listing(req.body.ListingsArr);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    // 🗺️ 4. Save geometry
    newListing.geometry = {
        type: "Point",
        coordinates: coordinates // [longitude, latitude]
    };
   
    await newListing.save();
    req.flash("success", "New Property added Sucessfully!");
    console.log(req.body.ListingsArr);
    res.redirect("/listings");
}





// module.exports.createListing = async (req, res) => {
//     try {
//         let url = req.file.path;
//         let filename = req.file.filename;

//         // 📍 1. Extract location + country
//         const { location, country } = req.body.ListingsArr;

//         // 📍 2. Convert to coordinates
//         const coordinates = await getCoordinates(location, country);

//         // 📦 3. Create listing
//         let newListing = new Listing(req.body.ListingsArr);

//         newListing.owner = req.user._id;
//         newListing.image = { url, filename };

//         // 🗺️ 4. Save geometry
//         newListing.geometry = {
//             type: "Point",
//             coordinates: coordinates // [longitude, latitude]
//         };

//         // 💾 5. Save
//         await newListing.save();

//         req.flash("success", "New Property added Successfully!");
//         res.redirect("/listings");

//     } catch (err) {
//         console.error(err);
//         req.flash("error", "Invalid location or something went wrong");
//         res.redirect("/listings");
//     }
// };

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