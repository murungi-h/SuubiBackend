const request = require("supertest");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const vlogController = require("../controllers/vlog");
const Vlog = require("../models/vlog");

// Mock the Vlog model
jest.mock("../models/vlog");

const app = express();
app.use(express.json());

// Define the routes
app.get("/vlogs/", vlogController.getVlogs);
app.post("/vlogs/", vlogController.addVlog);
app.get("/vlogs/:id", vlogController.getVlog);
app.patch("/vlogs/:id", vlogController.updateVlog);
app.delete("/vlogs/:id", vlogController.deleteVlog);

describe("Vlog Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("get all vlogs", () => {
    it("should return 200 and list of vlogs", async () => {
      const mockVlogs = [
        { _id: "60d21b4667d0d8992e610d85", title: "Vlog 1" },
        { _id: "60d21b4667d0d8992e610d86", title: "Vlog 2" },
      ];
      Vlog.find.mockResolvedValue(mockVlogs);
      const res = await request(app).get("/vlogs");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.vlogs).toEqual(mockVlogs);
    });

    it("should return 200 with 'No vlogs available' message if no vlogs found", async () => {
      Vlog.find.mockResolvedValue([]);
      const res = await request(app).get("/vlogs");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.info).toBe("No vlogs available");
    });
  });

  describe("add vlog", () => {
    it("should return 201 and saved vlog", async () => {
      const mockVlog = {
        _id: "60d21b4667d0d8992e610d85",
        title: "New Vlog",
      };
      Vlog.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockVlog),
      }));
      const res = await request(app).post("/vlogs").send({
        title: "New Vlog",
        author: "Author",
        url: "http://example.com",
        date: "2021-06-22",
        facilityId: "60d21b4667d0d8992e610c85",
      });
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body.vlog).toEqual(mockVlog);
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/vlogs").send({});
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Please provide all vlog details");
    });
  });

  describe("get vlog details", () => {
    it("should return 200 and vlog if found", async () => {
      const mockVlog = {
        _id: "60d21b4667d0d8992e610d85",
        title: "Vlog 1",
      };
      Vlog.findById.mockResolvedValue(mockVlog);
      const res = await request(app).get("/vlogs/60d21b4667d0d8992e610d85");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.vlog).toEqual(mockVlog);
    });

    it("should return 404 if vlog not found", async () => {
      Vlog.findById.mockResolvedValue(null);
      const res = await request(app).get("/vlogs/60d21b4667d0d8992e610d85");
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("No vlog with id : 60d21b4667d0d8992e610d85");
    });

    it("should return 400 if id is invalid", async () => {
      const res = await request(app).get("/vlogs/invalidId");
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid vlog id");
    });
  });

  describe("update vlog details", () => {
    it("should return 200 and updated vlog", async () => {
      const mockVlog = {
        _id: "60d21b4667d0d8992e610d85",
        title: "Updated Vlog",
      };
      Vlog.findByIdAndUpdate.mockResolvedValue(mockVlog);
      const res = await request(app)
        .patch("/vlogs/60d21b4667d0d8992e610d85")
        .send({ title: "Updated Vlog" });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.vlog).toEqual(mockVlog);
    });

    it("should return 404 if vlog not found", async () => {
      Vlog.findByIdAndUpdate.mockResolvedValue(null);
      const res = await request(app)
        .patch("/vlogs/60d21b4667d0d8992e610d85")
        .send({ title: "Updated Vlog" });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("Vlog not found");
    });

    it("should return 400 if id is invalid", async () => {
      const res = await request(app)
        .patch("/vlogs/invalidId")
        .send({ title: "Updated Vlog" });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid vlog id");
    });
  });

  describe("delete vlog", () => {
    it("should return 200 and success message if vlog deleted", async () => {
      const mockVlog = {
        _id: "60d21b4667d0d8992e610d85",
        title: "Vlog to delete",
      };
      Vlog.findByIdAndDelete.mockResolvedValue(mockVlog);
      const res = await request(app).delete("/vlogs/60d21b4667d0d8992e610d85");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.message).toBe("Vlog deleted successfully");
    });

    it("should return 404 if vlog not found", async () => {
      Vlog.findByIdAndDelete.mockResolvedValue(null);
      const res = await request(app).delete("/vlogs/60d21b4667d0d8992e610d85");
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("Vlog not found");
    });

    it("should return 400 if id is invalid", async () => {
      const res = await request(app).delete("/vlogs/invalidId");
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid vlog id");
    });
  });
});
