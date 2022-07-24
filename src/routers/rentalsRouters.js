import { Router } from "express";
import {
  deleteRental,
  postRental,
  returnRental,
} from "../controlers/rentalsControlers.js";

const router = Router();

router.post("/rentals", postRental);
router.post("/rentals/:id/return", returnRental);
router.delete("/rentals/:id", deleteRental);

export default router;
