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

describe("POST /api/v1/currency/favorite", () => {
	it("should return 201 and save favorite pair", async () => {
		const res = await request(app)
			.post("/api/v1/currency/favorite")
			.set("Authorization", `${Token}`)
			.send({ base: "USD", target: "EUR" });

		expect(res.statusCode).toBe(201);
        expect(res.body.status)
	});

	it("should return 400 when missing required fields", async () => {
		const res = await request(app)
			.post("/api/v1/currency/favorite")
			.set("Authorization", `${Token}`)
			.send({ base: "USD" });

		expect(res.statusCode).toBe(400);
		expect(res.body.status).toBe("error");
        expect(res.body.message).toBe(
			"Base and target currencies are required"
		);
	});
});
