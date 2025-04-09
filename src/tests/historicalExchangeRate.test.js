import request from "supertest";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
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

describe("POST /api/v1/currency/historical", () => {
	it("should return 200 and fetch historical exchange rates", async () => {
		currencyService.getHistoricalRate.mockResolvedValue([
			{ date: "2025-03-01", rate: 1.2 },
			{ date: "2025-03-02", rate: 1.3 },
		]);

		const res = await request(app)
			.post("/api/v1/currency/historical")
			.set("Authorization", `${Token}`)
			.send({
				base: "USD",
				target: "EUR",
				start_date: "2024-03-01",
				end_date: "2025-03-02",
			});

		expect(res.statusCode).toBe(200);
		expect(res.body.status).toBe("success");
	});
	it("should return 400 when missing required fields", async () => {
		const res = await request(app)
			.post("/api/v1/currency/historical")
			.set("Authorization", `${Token}`)
			.send({
				base: "USD",
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.status).toBe("error");
		expect(res.body.message).toBe(
			"Please provide base, target, start_date and end_date"
		);
	});

	it("should return 500 if API call fails", async () => {
		currencyService.getHistoricalRate.mockRejectedValue(
			new Error("API call failed")
		);

		const res = await request(app)
			.post("/api/v1/currency/historical")
			.set("Authorization", `${Token}`)
			.send({
				base: "USD",
				target: "EUR",
				start_date: "2024-03-01",
				end_date: "2025-03-02",
			});

		expect(res.statusCode).toBe(500);
		expect(res.body.status).toBe("error");
		expect(res.body.message).toBe("API call failed");
	});
});
