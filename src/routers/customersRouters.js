import { Router } from "express";
import {
  getCustomer,
  getCustomers,
  postCustomer,
  putCustomer,
} from "../controlers/customersControlers.js";

const router = Router();

router.post("/customers", postCustomer);
router.put("/customers/:id", putCustomer);
router.get("/customers/:id", getCustomer);
router.get("/customers/", getCustomers);

export default router;
