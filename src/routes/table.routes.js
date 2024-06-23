import { Router } from "express";
import {
  addTable,
  deleteTable,
  updateTable,
  getAllTables
} from "../controllers/table.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);

router.route("/add").post(addTable);
router.route("/:tableId").delete(deleteTable).patch(updateTable);
router.route("/").get(getAllTables);

export default router;
