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

describe("GET /api/v1/currency/favorite", () => {
	it("should return 200 and fetch saved favorite pairs", async () => {
		const res = await request(app)
			.get("/api/v1/currency/favorite")
			.set("Authorization", `${Token}`);

		expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("success");
	});

	it("should return 401 when no token is provided", async () => {
		const res = (await request(app).get("/api/v1/currency/favorite")).set(
			"Authorization",
			`${Token}`
		);

		expect(res.statusCode).toBe(401);
	});
});
