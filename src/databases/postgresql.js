import pg from "pg";

const { Pool } = pg;

const connectionpg = new Pool({
  user: "postgres",
  password: "0350365",
  database: "boardcamp",
  host: "localhost",
  port: "5432",
});

export default connectionpg;
