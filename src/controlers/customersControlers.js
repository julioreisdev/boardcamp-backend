import connectionpg from "../databases/postgresql.js";
import customerSchema from "../schemas/customerSchema.js";

export async function postCustomer(req, res) {
  const { error } = customerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const erros = error.details.map((detail) => detail.message);
    return res.status(400).send(erros);
  }
  const { name, phone, cpf, birthday } = req.body;
  try {
    const { rows: cpfExist } = await connectionpg.query(
      `
      SELECT * FROM customers WHERE cpf = $1
    `,
      [cpf]
    );
    if (cpfExist.length !== 0) {
      return res.sendStatus(409);
    }
    await connectionpg.query(
      `
      INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)
    `,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function putCustomer(req, res) {
  const { error } = customerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const erros = error.details.map((detail) => detail.message);
    return res.status(400).send(erros);
  }
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;
  try {
    await connectionpg.query(
      `
      UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5
    `,
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getCustomer(req, res) {
  const { id } = req.params;
  try {
    const { rows: user } = await connectionpg.query(
      `
      SELECT * FROM customers WHERE id = $1
    `,
      [id]
    );
    if (user.length === 0) {
      return res.sendStatus(404);
    }
    return res.send(user[0]);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function getCustomers(req, res) {
  const { cpf } = req.query;
  if (cpf) {
    try {
      const { rows: users } = await connectionpg.query(
        `
        SELECT * FROM customers WHERE cpf LIKE $1
      `,
        [`%${cpf}%`]
      );
      return res.send(users);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  try {
    const { rows: users } = await connectionpg.query(`
      SELECT * FROM customers
    `);
    return res.send(users);
  } catch (error) {
    return res.status(500).send(error);
  }
}
