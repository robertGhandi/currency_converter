import { currencyMap, defaultCurrencyMap } from "./currencyCodes.js";

// Helper function to suggest currency codes
export const suggestCurrency = (input) => {
	const lowerInput = input.toLowerCase();

	// Find similar currency names based on input
	const suggestions = Object.entries(currencyMap)
		.filter(
			([code, name]) =>
				name.toLowerCase().includes(lowerInput) ||
				code.toLowerCase() === lowerInput
		)
		.map(([, name]) => name); // Return currency codes

	return suggestions.length ? suggestions.slice(0, 3) : []; // Return top 3 matches
};

// Helper function to normalize currency input
const normalizeCurrencyInput = (value) => {
	value = value.trim().toLowerCase();

	// Check if it's a default mapped currency (e.g., "dollar" → "USD")
	if (defaultCurrencyMap[value]) {
		return defaultCurrencyMap[value];
	}

	// Check if it's already a valid currency code
	if (currencyMap[value.toUpperCase()]) {
		return value.toUpperCase();
	}

	// Find currency code from the full currency name
	const foundCode = Object.keys(currencyMap).find(
		(code) => currencyMap[code].toLowerCase() === value
	);
	if (foundCode) {
		return foundCode;
	}

	// If invalid, return null
	return null;
};

// Middleware to normalize currency input
export const normalizeCurrency = (req, res, next) => {
	try {
		if (!req.body || typeof req.body !== "object") {
			return res.status(400).json({
				status: "error",
				message: "Invalid request body.",
			});
		}

		const errors = {}; // Collect all errors first

		for (const key of ["base", "target"]) {
			if (!req.body[key] || typeof req.body[key] !== "string") {
				errors[key] = `Invalid currency input for "${key}".`;
				continue;
			}

			const normalizedCurrency = normalizeCurrencyInput(req.body[key]);
			if (normalizedCurrency) {
				req.body[key] = normalizedCurrency; // Update request body with normalized value
			} else {
				const suggestions = suggestCurrency(req.body[key]);
				errors[key] = suggestions.length
					? `Invalid currency: "${req.body[key]}". Did you mean ${suggestions.join(", ")}?`
					: `Invalid currency: "${req.body[key]}". No similar currencies found.`;
			}
		}

		// If errors exist, return them in a single response
		if (Object.keys(errors).length > 0) {
			return res.status(400).json({
				status: "error",
				message: "Invalid currency input.",
				errors,
			});
		}

		next(); // Proceed if everything is valid
	} catch (error) {
		console.error("Error normalizing currency input:", error); // Log the error for debugging
		res.status(500).json({
			status: "error",
			message: "Error normalizing currency input.",
		});
	}
};
