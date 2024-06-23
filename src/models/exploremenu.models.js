import mongoose from "mongoose";

const exploreSchema = new mongoose.Schema({
  menu_name: {
    type: String,
    required: true,
  },
  menu_image: {
    type: String,
    required: true,
  },
});

export const Explore = mongoose.model("Explore",exploreSchema)