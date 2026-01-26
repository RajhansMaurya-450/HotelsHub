const express = require("express");
const mongoose = require("mongoose");
const MONGO_URL ='mongodb://127.0.0.1:27017/HotelsHub';
const Listing = require("../models/listing.js");
const newData = require("./data.js");


async function main() {
  await mongoose.connect(MONGO_URL);

}
main().then(()=>{
  console.log("succesful!");
})
.catch (err => console.log(err));

//function to clean old data from db and insert new data....

const insertDB = async() => {
    await Listing.deleteMany({});
     console.log("DB cleared!");
    // console.log(newData.data);
     await Listing.insertMany(newData.data);
    console.log("Data inserted!");

};

insertDB();