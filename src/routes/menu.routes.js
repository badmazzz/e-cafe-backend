import { Router } from "express";
import {
  addItem,
  removeItem,
  updateItem,
  getAllMenuItem,
  exploreMenuItem
} from "../controllers/menu.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/add").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  addItem
);
router.route("/:menuId").delete(removeItem).patch(updateItem);
router.route("/").get(getAllMenuItem);
router.route("/explore").get(exploreMenuItem);

export default router;
