const request = require("supertest");
const app = require("../server");

describe("Document Service API", () => {
  describe("POST /api/document/upload", () => {
    it("should upload a document", async () => {
      // TODO: Mock file upload and test
    });
  });

  describe("GET /api/document", () => {
    it("should list documents", async () => {
      const res = await request(app).get("/api/document").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/document/:docId", () => {
    it("should get a document by id", async () => {
      // TODO: Mock document and test
    });
  });

  describe("PUT /api/document/:docId", () => {
    it("should update a document", async () => {
      // TODO: Mock document and test
    });
  });

  describe("DELETE /api/document/:docId", () => {
    it("should delete a document", async () => {
      // TODO: Mock document and test
    });
  });
});
