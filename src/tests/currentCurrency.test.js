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

describe("GET /api/v1/currency/current-rate", () => {
	it("should return 200 and fetch current exchange rate", async () => {
		currencyService.getCurrentRate.mockResolvedValue({
			rate: 1.2,
		});

		const res = await request(app)
			.get("/api/v1/currency/current-rate")
			.set("Authorization", `${Token}`)
			.send({
				base: "USD",
				target: "EUR",
			});

		expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("success");
	});

	it("should return 400 when missing required fields", async () => {
		const res = await request(app)
			.get("/api/v1/currency/current-rate")
			.set("Authorization", `${Token}`)
			.send({
				base: "USD",
			});

		expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe("error");
		expect(res.body.message).toBe(
			"Base and target currencies are required"
		);
	});

	it("should return 500 if API call fails", async () => {
		currencyService.getCurrentRate.mockRejectedValue(
			new Error("API error")
		);

		const res = await request(app)
			.get("/api/v1/currency/current-rate")
			.set("Authorization", `${Token}`)
			.send({
				base: "USD",
				target: "EUR",
			});

		expect(res.statusCode).toBe(500);
		expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("API error");
	});
});
