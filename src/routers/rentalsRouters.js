import { Router } from "express";
import { postRental, returnRental } from "../controlers/rentalsControlers.js";

const router = Router();

router.post("/rentals", postRental);
router.post("/rentals/:id/return", returnRental);

export default router;
