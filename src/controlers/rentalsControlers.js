import connectionpg from "../databases/postgresql.js";
import rentalSchema from "../schemas/rentalSchema.js";

let data = new Date();
let dia = String(data.getDate()).padStart(2, "0");
let mes = String(data.getMonth() + 1).padStart(2, "0");
let ano = data.getFullYear();

export async function postRental(req, res) {
  const { error } = rentalSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const erros = error.details.map((detail) => detail.message);
    return res.status(422).send(erros);
  }
  try {
    const { customerId, gameId, daysRented } = req.body;
    const { rows: game } = await connectionpg.query(
      `
      SELECT  * FROM games WHERE games.id = $1
    `,
      [gameId]
    );
    const { rows: customer } = await connectionpg.query(
      `
      SELECT  * FROM customers WHERE customers.id = $1
    `,
      [customerId]
    );
    const { rows: rentals } = await connectionpg.query(
      `
      SELECT  * FROM rentals WHERE rentals."gameId" = $1
    `,
      [gameId]
    );

    if (game.length === 0) {
      return res.sendStatus(400);
    }

    const dataAtual = ano + "-" + mes + "-" + dia;
    const originalPrice = daysRented * game[0].pricePerDay;
    const returnDate = null;
    const delayFee = null;

    if (
      customer.length === 0 ||
      daysRented <= 0 ||
      game[0].stockTotal - rentals.length === 0
    ) {
      return res.sendStatus(400);
    }

    await connectionpg.query(
      `
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        customerId,
        gameId,
        dataAtual,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function returnRental(req, res) {
  const { id } = req.params;
  try {
    const dataAtual = ano + "-" + mes + "-" + dia;
    const { rows: rental } = await connectionpg.query(
      `
    SELECT * FROM rentals WHERE id = $1
   `,
      [id]
    );
    const { rows: game } = await connectionpg.query(
      `
      SELECT * FROM games WHERE id = $1
    `,
      [rental[0].gameId]
    );
    if (rental.length === 0) {
      return res.sendStatus(404);
    }
    if (rental[0].returnDate !== null) {
      return res.sendStatus(400);
    }
    const now = new Date();
    const past = new Date(rental[0].rentDate);
    const diff = Math.abs(now.getTime() - past.getTime());
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

    let delayFee = null;
    if (diffDays - 1 > rental[0].daysRented) {
      delayFee = ((diffDays - 1) - rental[0].daysRented) * game[0].pricePerDay;
    }
    await connectionpg.query(
      `
      UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id = $3
    `,
      [dataAtual, delayFee, id]
    );
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;
  try {
    const {rows: rental} = await connectionpg.query(`
      SELECT * FROM rentals WHERE id = $1
    `, [id]);
    if (rental.length === 0) {
      return res.sendStatus(404);
    }
    if (rental[0].returnDate === null) {
      return res.sendStatus(400);
    }
    await connectionpg.query(`
      DELETE FROM rentals WHERE id = $1
    `, [id]);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error);
  }
}