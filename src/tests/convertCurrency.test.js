import request from "supertest";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import app from "../index.js";
import * as currencyService from "../services/currencyBeacon.service.js";
import supabase from "../config/supabase.js";

let Token;
beforeAll(async () => {
	const { data, error } = await supabase.auth.signInWithPassword({
		email: process.env.TEST_EMAIL,
		password: process.env.TEST_PASSWORD,
	});

	if (error || !data?.session?.access_token) {
		console.error("Error logging in test user:", error.message);
		throw new Error("Failed to log in test user");
	}

	Token = `Bearer ${data.session.access_token}`;
	console.log("Test Token:", Token);

	await new Promise((resolve) => setTimeout(resolve, 1000));
});

vi.mock("../services/currencyBeacon.service.js");

beforeEach(() => {
	vi.clearAllMocks();
});

describe("POST /api/v1/currency/convert", () => {
	it("should return 200 and convert currency successfully", async () => {
		currencyService.getExchangeRate.mockResolvedValue({
			response: {
				timestamp: 1741551333,
				rate: 1.2,
				converted_amount: 120,
			},
		});

		const res = await request(app)
			.post("/api/v1/currency/convert")
			.set("Authorization", `${Token}`)
			.send({
				base: "USD",
				target: "EUR",
				amount: 100,
			});

		expect(res.statusCode).toBe(200);
		expect(res.body.status).toBe("success");
		expect(res.body.data).toHaveProperty("timestamp");
	}, 10000);

	it("should return 400 when missing fields", async () => {
		const res = await request(app)
			.post("/api/v1/currency/convert")
			.set("Authorization", `${Token}`)
			.send({
				base: "USD",
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.status).toBe("error");
		expect(res.body.message).toBe("Please provide base, target and amount");
	}, 10000);

	it("should return 500 if API call fails", async () => {
		currencyService.getExchangeRate.mockRejectedValue(
			new Error("API call failed")
		);

		const res = await request(app)
			.post("/api/v1/currency/convert")
			.set("Authorization", `${Token}`)
			.send({
				base: "USD",
				target: "EUR",
				amount: 100,
			});

		expect(res.statusCode).toBe(500);
		expect(res.body.status).toBe("error");
		expect(res.body.message).toBe("API call failed");
	}, 10000);
});
