import { Router } from "express";
import { createOrder } from "../controllers/order.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(createOrder);

export default router;
