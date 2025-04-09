import Joi from "joi";

// Validation schema for user registration
export const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format.",
        "any.required": "Email is required.",
    }),
    first_name: Joi.string().min(2).max(50).required().messages({
        "string.min": "First name must be at least 2 characters.",
        "string.max": "First name must not exceed 50 characters.",
        "any.required": "First name is required.",
    }),
    last_name: Joi.string().min(2).max(50).required().messages({
        "string.min": "Last name must be at least 2 characters.",
        "string.max": "Last name must not exceed 50 characters.",
        "any.required": "Last name is required.",
    }),
    password: Joi.string().min(8).max(25).required().messages({
        "string.min": "Password must be at least 8 characters.",
        "string.max": "Password must not exceed 25 characters.",
        "any.required": "Password is required.",
    }),
});

// Validation schema for user login
export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Invalid email format.",
        "any.required": "Email is required.",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required.",
    }),
});

// Middleware function to validate request body
export const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            status: "error",
            message: "Validation error.",
            errors: error.details.map((err) => err.message),
        });
    }

    next();
};
