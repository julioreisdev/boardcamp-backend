import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoriesRouters from "./routers/categoriesRouters.js";
import gamesRouters from "./routers/gamesRouters.js";

dotenv.config();
const app = express();

app.use(express.json(), cors());
app.use(categoriesRouters);
app.use(gamesRouters);

app.listen(process.env.PORT, () => {
  console.log("Server runnig!!!");
});
