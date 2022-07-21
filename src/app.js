import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json(), cors());

app.listen(process.env.PORT, () => {
  console.log("Server runnig!!!");
});
