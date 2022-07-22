import joi from "joi";

const gameSchema = joi.object({
  name: joi.string().min(0).required(),
  image: joi.string().uri().required(),
  stockTotal: joi.number().required(),
  pricePerDay: joi.number().required(),
  categoryId: joi.number().required(),
});

export default gameSchema;
