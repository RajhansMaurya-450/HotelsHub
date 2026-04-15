const express = require("express");
const mongoose = require("mongoose");
const PORT = 2020;
const app = express();
const MONGO_URL ='mongodb://127.0.0.1:27017/HotelsHub';
const Listing = require("./models/listing.js")
const path = require("path");
const ejsMate = require('ejs-mate'); //for the modularity of ejs repeated codes...............
const wrapAsync = require("./Utils/wrapAsync.js"); //file required from utils folder that handles the error...
const ExpressError = require("./Utils/ExpressError.js"); //file required from utils folder to handle error....
const Joi = require("joi");
const listingRouter = require("./routes/listings.js")
const reviewRouter = require("./routes/review.js")
const userrouter = require("./routes/user.js")
const session = require('express-session');
const sessionOptions = {  //session Object...............
    secret: "musssession",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+15*24*60*60*60*1000,
        maxAge:15*24*60*60*60*1000,
        httpOnly:true
    },
};
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");



app.set("view engine","ejs"); // use to render the ejs files..............
app.set("views",path.join(__dirname, "views"));// use to render the ejs files..............
const methodOverride = require("method-override");
const Review = require("./models/review.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const { maxHeaderSize } = require("http");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate );
app.use(express.static(path.join(__dirname,"/public")));



app.use(session(sessionOptions)); //session middleware.........
app.use(flash());

app.use(passport.initialize()); //passport middleware and user intialization......................
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());//serialize and deserialize user is used by passport to manage user session...they determine how user info is stored in the session and how it is retrieved in subsequent request..............
passport.deserializeUser(User.deserializeUser());




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
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

// app.get("/demouser",async(req,res)=>{ //demo user for login authentication...............
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//    let registeredUser = await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);
// })



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

//show route...........
app.get("/listingData/:id",wrapAsync(async(req,res)=>{
    let{id} = req.params;
    let singleData = await Listing.findById(id).populate("reviews");
    // console.log(singleData);
    if(!singleData){
        req.flash("error","The Item Your have requested does not exist or deleted!");
        res.redirect("/listings");
    }
    else{
        res.render("listing/show.ejs",{singleData});
    }
    
}))

app.get("/listing/new",wrapAsync(async(req,res)=>{
    res.render("listing/AddnewHotel.ejs");
}))



app.use("/listings",listingRouter); //this route is used to access the CRUD opteration routes by using express router....

app.use("/listingData/:id/reviews",reviewRouter); //this route is used to add review particular listings

//signup route................
app.use("/",userrouter);


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

