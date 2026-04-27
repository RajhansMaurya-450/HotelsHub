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

// const insertDB = async() => {
//     await Listing.deleteMany({});
//      console.log("DB cleared!");
//     // console.log(newData.data);
//     newData.data = newData.data.map((obj) => ({...obj, owner: "69e22a9051972ae78efe1997"}))
//      await Listing.insertMany(newData.data);
//     console.log("Data inserted!");

// };
//  insertDB();

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("DB cleared!");

  const coordsMap = {
    "Malibu": [-118.7798, 34.0259],
    "New York City": [-74.0060, 40.7128],
    "Aspen": [-106.8175, 39.1911],
    "Florence": [11.2558, 43.7696],
    "Portland": [-122.6765, 45.5231],
    "Cancun": [-86.8515, 21.1619],
    "Amsterdam": [4.9041, 52.3676],
    "Los Angeles": [-118.2437, 34.0522],
    "Bali": [115.1889, -8.4095],
    "Tokyo": [139.6917, 35.6895]
  };

  newData.data = newData.data.map((obj) => ({
    ...obj,
    owner: "69e22a9051972ae78efe1997",
    geometry: {
      type: "Point",
      coordinates: coordsMap[obj.location] || [77.2090, 28.6139] // fallback (Delhi)
    }
  }));

  await Listing.insertMany(newData.data);
  console.log("data inserted successfully");
};

//initDB();