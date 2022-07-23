import { Router } from "express";
import { postRental } from "../controlers/rentalsControlers.js";

const router = Router();

router.post("/rentals", postRental);

export default router;
