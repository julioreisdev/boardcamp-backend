import connectionpg from "../databases/postgresql.js";
import gameSchema from "../schemas/gameSchema.js";

export async function postGames(req, res) {
  const { error } = gameSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const erros = error.details.map((detail) => detail.message);
    return res.status(422).send(erros);
  }
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  try {
    const { rows: category } = await connectionpg.query(
      `
      SELECT * FROM categories WHERE id = $1
    `,
      [categoryId]
    );
    const { rows: nameGame } = await connectionpg.query(
      `
      SELECT * FROM games WHERE name = $1
    `,
      [name]
    );
    if (
      category.length === 0 ||
      name.length === 0 ||
      stockTotal <= 0 ||
      pricePerDay <= 0
    ) {
      return res.sendStatus(400);
    }
    if (nameGame.length > 0) {
      return res.sendStatus(409);
    }
    await connectionpg.query(
      `
      INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)
    `,
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function getGames(req, res) {
  const { name } = req.query;
  if (name) {
    try {
      const { rows: games } = await connectionpg.query(
        `
        SELECT games.*, categories.name as "categoryName" 
        FROM games JOIN categories 
        ON games."categoryId" = categories.id
        WHERE games.name LIKE LOWER($1)
      `,
        [`%${name}%`]
      );
      return res.send(games);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  try {
    const { rows: games } = await connectionpg.query(`
      SELECT games.*, categories.name as "categoryName" 
      FROM games JOIN categories 
      ON games."categoryId" = categories.id
    `);
    return res.send(games);
  } catch (error) {
    return res.status(500).send(error);
  }
}
