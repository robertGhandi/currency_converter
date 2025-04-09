import {
	getExchangeRate,
	getHistoricalRate,
	getCurrentRate,
} from "../services/currencyBeacon.service.js";
import { prisma } from "../config/prismaClient.js";
import logger from "../utils/logger.js";

const convertCurrency = async (req, res) => {
	try {
		const { base, target, amount } = req.body;

		const result = await getExchangeRate(base, target, amount);
		let timestamp = result.response.timestamp;
		let date = new Date(timestamp * 1000);
		date.toISOString();

		const formattedValue = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: target,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(result.response.value);

		logger.info("Currency conversion successful", { base, target, amount });

		return res.status(200).json({
			status: "success",
			message: "Currency conversion successful",
			data: {
				...result.response,
				timestamp: date,
				value: formattedValue,
			},
		});
	} catch (error) {
		logger.error("Error converting currency", { error: error.message });
		res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const getHistoricalExchangeRate = async (req, res) => {
	try {
		const { base, target, start_date, end_date } = req.body;

		const response = await getHistoricalRate(
			base,
			target,
			start_date,
			end_date
		);

		logger.info("Historical exchange rate fetched successfully", {
			base,
			target,
		});

		return res.status(200).json({
			status: "success",
			message: "Historical exchange rate fetched successfully",
			data: response,
		});
	} catch (error) {
		logger.error("Error fetching historical exchange rate", {
			error: error.message,
		});
		res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const getCurrentCurrencyRate = async (req, res) => {
	try {
		const { base, target } = req.body;

		const result = await getCurrentRate(base, target);
		logger.info("Fetched current currency rate", { base, target });
		res.status(200).json({ status: "success", data: result });
	} catch (error) {
		logger.error("Error fetching current currency rate", {
			error: error.message,
		});
		res.status(500).json({ status: "error", message: error.message });
	}
};

const batchConvertCurrency = async (req, res) => {
	try {
		const { conversions } = req.body;

		if (!Array.isArray(conversions) || conversions.length === 0) {
			logger.warn("Batch coversion request missing or invalid format");
			return res.status(400).json({
				status: "error",
				message:
					"please provide an array of conversion objects with base, target and amount",
			});
		}

		const results = await Promise.all(
			conversions.map(async ({ base, target, amount }) => {
				if (!base || !target || !amount) {
					return { base, target, error: "missing required fields" };
				}

				try {
					const result = await getExchangeRate(base, target, amount);
					const timestamp = result.response.timestamp;
					const date = new Date(timestamp * 1000);

					const formattedValue = new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: target,
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}).format(result.response.value);

					return {
						base,
						target,
						amount,
						converted_value: formattedValue,
						timestamp: date,
					};
				} catch (error) {
					logger.error("Error converting currency", {
						base,
						target,
						error: error.message,
					});
					return { base, target, error: error.message };
				}
			})
		);

		logger.info("Batch currency conversion completed successfully", {
			conversions,
		});

		return res.status(200).json({
			status: "success",
			message: "Batch currency conversion successfull",
			data: results,
		});
	} catch (error) {
		logger.error("Error processing batch conversion", {
			error: error.message,
		});
		res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

// Save favorite currency pair
const saveFavoritePair = async (req, res) => {
	try {
		const { base, target } = req.body;

		const userId = req.user.id;
		const favorite = await prisma.favoriteCurrencyPairs.create({
			data: { userId, base, target },
		});

		logger.info("Favorite currency pair saved successfully", {
			userId,
			base,
			target,
		});

		res.status(201).json({ status: "success", data: favorite });
	} catch (error) {
		logger.error("Error saving favorite pair", { error: error.message });
		res.status(500).json({ status: "error", message: error.message });
	}
};

// Get saved favorite currency pairs
const getFavoritePairs = async (req, res) => {
	try {
		const userId = req.user.id;
		const favorites = await prisma.favoriteCurrencyPairs.findMany({
			where: { userId },
		});

		logger.info("Fetched favorite currency pairs", { userId });

		res.status(200).json({ status: "success", data: favorites });
	} catch (error) {
		logger.error("Error fetching favorite currency pairs", {
			error: error.message,
		});
		res.status(500).json({ status: "error", message: error.message });
	}
};

export {
	convertCurrency,
	getHistoricalExchangeRate,
	getCurrentCurrencyRate,
	batchConvertCurrency,
	saveFavoritePair,
	getFavoritePairs,
};
