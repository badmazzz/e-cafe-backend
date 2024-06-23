import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Table } from "../models/table.models.js";
import { isValidObjectId } from "mongoose";

const addTable = asyncHandler(async (req, res) => {
  const { name, date, time, guests } = req.body;
  const userId = req.user?._id;

  if (![userId, name, date, time, guests].every(Boolean))
    throw new ApiError(400, "All fields are required");

  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid User ID");

  const existingTable = await Table.findOne({ date, time });
  if (existingTable)
    throw new ApiError(409, "Table is already booked for that date and time");

  const table = await Table.create({
    user: userId,
    name,
    date,
    time,
    guests,
  });

  res.status(200).json(new ApiResponse(200, table, "Table booked"));
});

const deleteTable = asyncHandler(async (req, res) => {
  const { tableId } = req.params;

  if (!isValidObjectId(tableId)) throw new ApiError(400, "Invalid Table ID");

  const deletedTable = await Table.findByIdAndDelete(tableId);

  if (!deletedTable) throw new ApiError(404, "Table booking not found");

  res
    .status(200)
    .json(new ApiResponse(200, deletedTable, "Table booking deleted"));
});

const updateTable = asyncHandler(async (req, res) => {
  const { tableId } = req.params;
  const { name, date, time, guests } = req.body;

  if (!isValidObjectId(tableId)) throw new ApiError(400, "Invalid Table ID");

  const currentTable = await Table.findById(tableId);
  if (!currentTable) throw new ApiError(404, "Table booking not found");

  const newDate = date || currentTable.date;
  const newTime = time || currentTable.time;

  const existingTable = await Table.findOne({
    _id: { $ne: tableId },
    date: newDate,
    time: newTime,
  });

  if (existingTable) {
    throw new ApiError(409, "Table is already booked for that date and time");
  }

  const table = await Table.findByIdAndUpdate(
    tableId,
    { name, date, time, guests },
    { new: true, runValidators: true }
  );

  if (!table) throw new ApiError(404, "Table booking not found");

  res.status(200).json(new ApiResponse(200, table, "Table booking updated"));
});

const getAllTables = asyncHandler(async (req, res) => {
  const tables = await Table.aggregate([
    { $match: { user: req.user?._id } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              username: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, tables, "Tables fetched successfully"));
});


const getTableById = asyncHandler(async (req, res) => {});

export { addTable, deleteTable, updateTable, getAllTables };
