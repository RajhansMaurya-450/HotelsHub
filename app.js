const express = require("express");
const mongoose = require("mongoose");
const PORT = 2020;
const app = express();
const MONGO_URL ='mongodb://127.0.0.1:27017/HotelsHub';
const Listing = require("./models/listing.js")
const path = require("path");
const ejsMate = require('ejs-mate');

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


app.get("/listings",async(req,res)=>{
    let hotelsData = await Listing.find();
    res.render("listing/index.ejs",{hotelsData});
    // console.log(hotelsData);
    // res.send(hotelsData);
})

app.get("/listingData/:id",async(req,res)=>{
    let{id} = req.params;
    let singleData = await Listing.findById(id);
    // console.log(singleData);
    res.render("listing/show.ejs",{singleData});
})
app.get("/listing/new",async(req,res)=>{
    res.render("listing/AddnewHotel.ejs");
})

app.put("/listings",async(req,res)=>{
    let newListing = new Listing(req.body.ListingsArr);
    await newListing.save();
    console.log(req.body.ListingsArr);
    res.redirect("/listings");
})

app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let editHoteldata = await Listing.findById(id);
    console.log(id);
    res.render("listing/EditHotelData.ejs",{editHoteldata});

});

app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let editHoteldata = await Listing.findByIdAndUpdate(id,req.body.ListingsArr);
    console.log(editHoteldata);
    res.redirect(`/listingData/${id}`);
})
app.delete("/listings/:id",async(req,res)=>{
     let {id} = req.params;
    let editHoteldata = await Listing.findByIdAndDelete(id);
    console.log(editHoteldata);
    res.redirect("/listings");
})