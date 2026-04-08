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
const Joi = require("joi");
const listingRouter = require("./routes/listings.js")
const reviewRouter = require("./routes/review.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
const methodOverride = require("method-override");
const Review = require("./models/review.js");
const { listingSchema,reviewSchema } = require("./schema.js");
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

const validateListing = (req,res,next) => { //server silde validation using Joi..............
    let{error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}


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

app.get("/listingData/:id",wrapAsync(async(req,res)=>{
    let{id} = req.params;
    let singleData = await Listing.findById(id).populate("reviews");
    // console.log(singleData);
    res.render("listing/show.ejs",{singleData});
}))

app.get("/listing/new",wrapAsync(async(req,res)=>{
    res.render("listing/AddnewHotel.ejs");
}))

app.use("/listings",listingRouter); //this route is used to access the CRUD opteration routes by using express router....

app.use("/listingData/:id/reviews",reviewRouter); //this route is used to




// simple middleware for error handling....
// app.use((err, req, res, next) =>{
//     res.send("Something went wrong");
// })


app.use((req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND!"))
})

//middleware for error handling using Express Error....
app.use((err, req, res, next) =>{
    let {message} = err;
    let statusCode = err.statusCode || 500;

    res.status(statusCode).render("error.ejs",{message});
})

