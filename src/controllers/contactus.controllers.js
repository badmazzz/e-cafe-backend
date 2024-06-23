import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ContactUs } from "../models/contactus.models.js";

const createContactUs = asyncHandler(async (req, res) => {
  const { message, subject } = req.body;
  const userId = req.user?._id;
  if (!message || !subject)
    throw new ApiError(400, "Message and subject both are required");

  const contactus = await ContactUs.create({
    user: userId,
    message,
    subject,
  });

  if (!contactus) throw new ApiError(400, "Error generating it.");

  res
    .status(200)
    .json(new ApiResponse(200, contactus, "Problem registered successfully.."));
});

export { createContactUs };
