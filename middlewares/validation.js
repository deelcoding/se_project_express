const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message("string.uri");
};

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    imageUrl: Joi.string().url().required(),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().url().required,
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required().messages({
      "string.length": "Invalid item ID length",
      "string.hex": "Invalid item ID format",
      "any.required": "Item ID is required",
    }),
  }),
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "Minimum name length is 2 characters",
      "string.max": "Maximum name length is 30 characters",
      "string.empty": "Name is required",
    }),
    imageUrl: Joi.string().custom(validateURL).messages({
      "string.url": "Image URL must be a valid URL",
      "string.empty": "Image URL must be filled",
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserInfo,
  validateUserLogin,
  validateItemId,
  validateCardBody,
};
