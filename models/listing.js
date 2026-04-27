const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  // image: {
  //   filename: {
  //     type: String,
  //     default: "listingimage",
  //   },
  //   url: {
  //     type: String,
  //     default:
  //       "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
  //   },
  // },
  // image:{
  //     type:String,
  //     default:"https://images.unsplash.com/photo-1768893517908-5661476bc1d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D",
  //     set: (v) => 
  //         v === ""
  //     ?"https://images.unsplash.com/photo-1768893517908-5661476bc1d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D"
  //     :v,
  // },
  image:{
    url:String,
    filename:String,
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    { //refrencing
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: [
    { //refrencing
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            
        }
    }

});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews.length) {
    await review.deleteMany({ _id: { $in: listing.reviews } });

  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;