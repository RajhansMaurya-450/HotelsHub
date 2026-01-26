const express = require("express");
const mongoose = require("mongoose");
const PORT = 2020;
const app = express();
const MONGO_URL ='mongodb://127.0.0.1:27017/HotelsHub';
const Listing = require("./models/listing.js")

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
app.get("/listing",async (req,res)=>{
    let newListing = new Listing(
        {
            title:"Shiv Ganga Home Stay",
            description:"A family friendly stay with great facilities which feels like home..",
            price: 1200,
            location: "Varanasi",
            country: "INDIA",
        }
    );
   await newListing.save();

    res.send("hello");
})

