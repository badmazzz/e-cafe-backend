import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Menu } from "../models/menu.models.js";
import { Order } from "../models/order.models.js";

const createOrder = asyncHandler(async (req, res) => {
  const { cartItems, totalAmount } = req.body;
  const userId = req.user?._id;

  if (![cartItems, totalAmount, userId].every(Boolean))
    throw new ApiError(400, "All feilds are required...");

  const order = await Order.create({
    user: userId,
    items: cartItems,
    totalAmount,
  });

  if (!order) throw new ApiError(400, "Order is not placed");
  setTimeout(async () => {
    try {
      await Order.findByIdAndUpdate(order?._id, {
        isDelivered: true,
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  }, 10000);

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order placed successfully"));
});

export { createOrder };
