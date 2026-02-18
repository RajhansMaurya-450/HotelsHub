const express = require("express");
const mongoose = require("mongoose");
const PORT = 2020;
const app = express();
const MONGO_URL ='mongodb://127.0.0.1:27017/HotelsHub';
const Listing = require("./models/listing.js")
const path = require("path");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./Utils/wrapAsync.js"); //file required from utils folder that handles the error...
const ExpressError = require("./Utils/ExpressError.js"); //file required from utils folder to handle error....

app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate );
app.use(express.static(path.join(__dirname,"/public")));



app.listen(PORT, (req,res) => {
   console.log(`server is running on the port ${PORT}`);
})
main().then(()=>{
  console.log("DB connection succesful!");
})
.catch (err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

}

app.get("/",(req,res)=>{
    res.send("Welcome to HotelsHub!");
})

//listing Route
// create object from models
// app.get("/listing",async (req,res)=>{
//     let newListing = new Listing(
//         {
//             title:"Shiv Ganga Home Stay",
//             description:"A family friendly stay with great facilities which feels like home..",
//             price: 1200,
//             location: "Varanasi",
//             country: "INDIA",
//         }
//     );
//    await newListing.save();

//     res.send("hello");
// })

//wrapAsync here & in other places of Asyn function is used that if the error occured on any route it will directed to the relevant error page.................
app.get("/listings",wrapAsync(async(req,res)=>{
    let hotelsData = await Listing.find();
    res.render("listing/index.ejs",{hotelsData});
    // console.log(hotelsData);
    // res.send(hotelsData);
}))

app.get("/listingData/:id",wrapAsync(async(req,res)=>{
    let{id} = req.params;
    let singleData = await Listing.findById(id);
    // console.log(singleData);
    res.render("listing/show.ejs",{singleData});
}))

app.get("/listing/new",wrapAsync(async(req,res)=>{
    res.render("listing/AddnewHotel.ejs");
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
app.put("/listings",wrapAsync(async(req,res)=>{

    if(!req.body.ListingsArr){
        throw new ExpressError(400,"ENTER A VALID DATA FOR LISTING!");
    }
    let newListing = new Listing(req.body.ListingsArr);
    await newListing.save();
    console.log(req.body.ListingsArr);
    res.redirect("/listings");
}));

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let editHoteldata = await Listing.findById(id);
    console.log(id);
    res.render("listing/EditHotelData.ejs",{editHoteldata});

}));

//Update ROute................
app.put("/listings/:id",wrapAsync(async(req,res)=>{

    if(!req.body.ListingsArr){
        throw new ExpressError(400,"ENTER A VALID DATA FOR LISTING!");
    }

    let {id} = req.params;
    let editHoteldata = await Listing.findByIdAndUpdate(id,req.body.ListingsArr);
    console.log(editHoteldata);
    res.redirect(`/listingData/${id}`);
}))

//Delete ROute..............
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
     let {id} = req.params;
    let editHoteldata = await Listing.findByIdAndDelete(id);
    console.log(editHoteldata);
    res.redirect("/listings");
}))

// simple middleware for error handling....
// app.use((err, req, res, next) =>{
//     res.send("Something went wrong");
// })


app.use((req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND!"))
})

//middleware for error handling using Express Error....
app.use((err, req, res, next) =>{
    let {statusCode,message} = err;
    res.status(statusCode).render("error.ejs",{message});
})