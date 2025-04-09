// services/currencyService.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CURRENCYBEACON_API_KEY = process.env.CURRENCYBEACON_API_KEY;
const BASE_URL = "https://api.currencybeacon.com/v1";

// Fetch real-time exchange rates
export async function getExchangeRate(base, target, amount) {
	try {
		const response = await axios.get(`${BASE_URL}/convert`, {
			params: {
				api_key: CURRENCYBEACON_API_KEY,
				from: base,
				to: target,
				amount: amount,
			},
		});
		return response.data;
	} catch (error) {
		throw new Error("Error fetching exchange rate");
	}
}

// Fetch historical exchange rates
export async function getHistoricalRate(base, target, start_date, end_date) {
	try {
		const start = new Date(start_date);
		const end = new Date(end_date);
		let currentDate = new Date(start);
		const rates = [];

		while (currentDate <= end) {
			const formattedDate = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
			const response = await axios.get(`${BASE_URL}/historical`, {
				params: {
					api_key: CURRENCYBEACON_API_KEY,
					base: base,
					symbols: target,
					date: formattedDate,
				},
			});

			rates.push({
				date: formattedDate,
				rates: response.data.rates[target],
			});

			currentDate.setDate(currentDate.getDate() + 1);
		}
		return rates;
	} catch (error) {
		throw new Error("Error fetching historical exchange rate");
	}
}

export async function getCurrentRate(base, target) {
	try {
		const response = await axios.get(`${BASE_URL}/latest`, {
			params: {
				api_key: CURRENCYBEACON_API_KEY,
				base: base,
				symbols: target,
			},
		});
		return {
			date: response.data.date,
			base: response.data.base,
			rates: response.data.rates,
		};
	} catch (error) {
		throw new Error("Error fetching current exchange rate");
	}
}
