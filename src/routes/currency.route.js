import express from "express";
import {
	convertCurrency,
	getHistoricalExchangeRate,
	getCurrentCurrencyRate,
	batchConvertCurrency,
	saveFavoritePair,
	getFavoritePairs,
} from "../controllers/currency.controller.js";
import authenticateSupabase from "../middlewares/authenticateSupabase.js";
import {
	currencyConversionSchema,
	historicalExchangeRateSchema,
	currencySchema,
	validateRequest,
} from "../validators/currency.validator.js";
import { normalizeCurrency } from "../utils/currencyName.js";

const router = express.Router();

router.post(
	"/convert",
	authenticateSupabase,
	normalizeCurrency,
	validateRequest(currencyConversionSchema),
	convertCurrency
);
router.post(
	"/historical",
	authenticateSupabase,
	normalizeCurrency,
	validateRequest(historicalExchangeRateSchema),
	getHistoricalExchangeRate
);
router.post("/batch-convert", authenticateSupabase, batchConvertCurrency);
router.post(
	"/favorite",
	authenticateSupabase,
	normalizeCurrency,
	validateRequest(currencySchema),
	saveFavoritePair
);
router.get("/favorite", authenticateSupabase, getFavoritePairs);
router.get(
	"/current-rate",
	authenticateSupabase,
	normalizeCurrency,
	validateRequest(currencySchema),
	getCurrentCurrencyRate
);

export default router;

//validateRequest(currencyConversionSchema)
