import connectionpg from "../databases/postgresql.js";
import joi from "joi";

export async function getCategories(req, res) {
  try {
    const categorias = await connectionpg.query("SELECT * FROM categories");
    return res.status(200).send(categorias.rows);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function postCategories(req, res) {
  const nameSchema = joi.object({
    name: joi.string().min(1).required(),
  });
  const { error } = nameSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const erros = error.details.map((detail) => detail.message);
    return res.status(400).send(erros);
  }
  try {
    const nameExist = await connectionpg.query(
      `SELECT * FROM categories WHERE name = '${req.body.name}'`
    );
    const resultQuery = nameExist.rows;
    if (resultQuery.length !== 0) {
      return res.status(409).send("Name already exists");
    }
    connectionpg.query(`INSERT INTO categories (name) VALUES ($1)`, [
      req.body.name,
    ]);
  } catch (error) {
    console.log("deu ruim");
    return res.status(500).send(error);
  }
  res.sendStatus(201);
}
