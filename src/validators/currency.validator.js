import Joi from "joi";
import { currencyMap } from "../utils/currencyCodes.js";

export const currencyConversionSchema = Joi.object({
    base: Joi.string()
        .valid(...Object.keys(currencyMap))
        
        .required()
        .messages({
            "any.only": "Invalid base currency code",
            "string.empty": "Base currency code is required",
        }),
    target: Joi.string()
        .valid(...Object.keys(currencyMap))
        
        .required()
        .messages({
            "any.only": "Invalid target currency code",
            "string.empty": "Target currency code is required",
        }),
    amount: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "number.base": "Amount must be a number",
            "number.positive": "Amount must be a positive number",

        })
})

export const historicalExchangeRateSchema = Joi.object({
    base: Joi.string()
        
		.valid(...Object.keys(currencyMap))
		.required()
		.messages({
			"any.only": "Invalid base currency code",
			"string.empty": "Base currency is required",
		}),

	target: Joi.string()
        
		.valid(...Object.keys(currencyMap))
		.required()
		.messages({
			"any.only": "Invalid target currency code",
			"string.empty": "Target currency is required",
		}),

	start_date: Joi.date()
		.iso()
		.less(Joi.ref("end_date")) // Ensures start_date is before end_date
		.required()
		.messages({
			"date.format": "Start date must be in YYYY-MM-DD format",
			"date.less": "Start date must be before end date",
			"any.required": "Start date is required",
		}),

	end_date: Joi.date()
		.iso()
		.required()
		.messages({
			"date.format": "End date must be in YYYY-MM-DD format",
			"any.required": "End date is required",
		}),
})

export const currencySchema = Joi.object({
    base: Joi.string()
        .valid(...Object.keys(currencyMap))
        .required()
        .messages({
            "any.only": "Invalid base currency code",
            "string.empty": "Base currency code is required",
        }),
    target: Joi.string()
        .valid(...Object.keys(currencyMap))
        .required()
        .messages({
            "any.only": "Invalid target currency code",
            "string.empty": "Target currency code is required",
        }),
})

export const validateRequest = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            status: "error",
            message: "Validation error.",
            errors: error.details.map((err) => err.message),
        });
    }

    req.body = value;

    next();
};

