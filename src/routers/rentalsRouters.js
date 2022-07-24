import { Router } from "express";
import {
  deleteRental,
  getRentals,
  postRental,
  returnRental,
} from "../controlers/rentalsControlers.js";

const router = Router();

router.post("/rentals", postRental);
router.post("/rentals/:id/return", returnRental);
router.delete("/rentals/:id", deleteRental);
router.get("/rentals", getRentals);

export default router;
