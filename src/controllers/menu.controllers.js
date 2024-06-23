import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  { isValidObjectId } from "mongoose";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { Menu } from "../models/menu.models.js";
import { Explore } from "../models/exploremenu.models.js";

const addItem = asyncHandler(async (req, res) => {
  const { name, category, price, description } = req.body;
  const userId = req.user?._id;

  if (![userId, name, description, category, price].every(Boolean)) {
    throw new ApiError(400, "All fields are required");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  const imageLocalFilePath = req.files?.image[0]?.path;
  if (!imageLocalFilePath) {
    throw new ApiError(400, "Image is required");
  }

  const image = await uploadOnCloudinary(imageLocalFilePath);

  const menu = await Menu.create({
    user: userId,
    name,
    description,
    price,
    category,
    image: image.url,
  });

  res.status(200).json(new ApiResponse(200, menu, "Item added"));
});

const removeItem = asyncHandler(async (req, res) => {
  const { menuId } = req.params;

  if (!isValidObjectId(menuId)) throw new ApiError(400, "Invalid Item ID");

  const deletedMenu = await Menu.findByIdAndDelete(menuId);

  if (!deletedMenu) throw new ApiError(404, "Menu Item does not found");

  res
    .status(200)
    .json(new ApiResponse(200, deletedMenu, "Table booking deleted"));
});

const updateItem = asyncHandler(async (req, res) => {
  const { menuId } = req.params;
  const { name, description, price, category } = req.body;

  if (!isValidObjectId(menuId)) throw new ApiError(400, "Invalid Menu ID");

  const menu = await Menu.findByIdAndUpdate(
    menuId,
    { name, description, price, category },
    { new: true, runValidators: true }
  );

  if (!menu) throw new ApiError(404, "Table booking not found");

  res.status(200).json(new ApiResponse(200, menu, "Table booking updated"));
});

const getAllMenuItem = asyncHandler(async (req, res) => {
  const menuItems = await Menu.find();
  if (!menuItems) throw new ApiError(400, "No menu items found");

  res.status(200).json(new ApiResponse(200, menuItems, "Menu item fetched"));
});

const exploreMenuItem = asyncHandler(async (req, res) => {
  const exploreMenuItems = await Explore.find();

  res
    .status(200)
    .json(
      new ApiResponse(200, exploreMenuItems, "Menu items category fetched")
    );
});

export { addItem, removeItem, updateItem, getAllMenuItem, exploreMenuItem };
