const request = require("supertest");
const app = require("../server");

describe("Notification Service API", () => {
  describe("GET /api/notification/health", () => {
    it("should return health status", async () => {
      const res = await request(app)
        .get("/api/notification/health")
        .expect(200);
      expect(res.body.status).toBe("OK");
    });
  });

  describe("GET /api/notification/stats", () => {
    it("should return notification stats", async () => {
      // TODO: Mock stats and test
    });
  });
});
