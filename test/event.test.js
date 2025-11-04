import { request } from "supertest";
import app from "../src/app";
import { describe, expect } from "vitest";

describe("Event API", () => {
    it ("GET /api/events should return an array " , async () => {
        const res = await request(app).get("/api/events");
        expect(res.status).toBe(200);
        expect ( Array.isArray (res.body)).toBe(true);
    });

    it("POST /api/events should add a new event", async () => {
        const res = await request(app).post("/api/events").send({name: "GP Paris",avaliableTicket: 1500, ticketCost:5000});
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("name");

    });
});