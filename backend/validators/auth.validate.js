import Joi from "joi";

export const userRegisterSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .trim()
    .required(),

  email: Joi.string()
    .email()
    .trim()
    .required(),

  password: Joi.string()
    .min(6)
    .max(20)
    .required(),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),

  bgmiGameId: Joi.string()
    .trim()
    .required()
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .required(),

  password: Joi.string()
    .required()
});

export const adminRegisterSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .trim()
    .required(),

  email: Joi.string()
    .email()
    .trim()
    .required(),

  password: Joi.string()
    .min(6)
    .max(20)
    .required(),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),

  secretKey: Joi.string()
    .required()
});