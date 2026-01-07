import Joi from "joi";

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Body validation error",
        errors: error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }))
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Query validation error",
        errors: error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }))
      });
    }

    req.query = value;
    next();
  };
};

/**
 * Validate URL params
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Params validation error",
        errors: error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }))
      });
    }

    req.params = value;
    next();
  };
};