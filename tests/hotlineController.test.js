const request = require("supertest");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const hotlineController = require("../controllers/hotline");
const Hotline = require("../models/hotline");

// Mock the Hotline model
jest.mock("../models/hotline");

const app = express();
app.use(express.json());

// Define the routes
app.get("/hotlines/", hotlineController.getHotlines);
app.post("/hotlines/", hotlineController.addHotline);
app.patch("/hotlines/:id", hotlineController.updateHotline);
app.delete("/hotlines/:id", hotlineController.deleteHotline);

describe("Hotline Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("get all hotlines", () => {
    it("should return 200 and list of hotlines", async () => {
      const mockHotlines = [
        { _id: "60d21b4667d0d8992e610d85", phoneNumber: "123456789" },
        { _id: "60d21b4667d0d8992e610d86", phoneNumber: "987654321" },
      ];
      Hotline.find.mockResolvedValue(mockHotlines);
      const res = await request(app).get("/hotlines");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.hotlines).toEqual(mockHotlines);
    });

    it("should return 200 with 'No hotlines available' message if no hotlines found", async () => {
      Hotline.find.mockResolvedValue([]);
      const res = await request(app).get("/hotlines");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.info).toBe("No hotlines available");
    });
  });

  describe("add hotline", () => {
    it("should return 201 and saved hotline", async () => {
      const mockHotline = {
        _id: "60d21b4667d0d8992e610d85",
        phoneNumber: "123456789",
      };
      Hotline.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockHotline),
      }));
      const res = await request(app).post("/hotlines").send({
        facilityId: "60d21b4667d0d8992e610c85",
        phoneNumber: "123456789",
      });
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body.hotline).toEqual(mockHotline);
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/hotlines").send({});
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Please provide hotline details");
    });
  });

  describe("update hotline", () => {
    it("should return 200 and updated hotline", async () => {
      const mockHotline = {
        _id: "60d21b4667d0d8992e610d85",
        phoneNumber: "987654321",
      };
      Hotline.findByIdAndUpdate.mockResolvedValue(mockHotline);
      const res = await request(app)
        .patch("/hotlines/60d21b4667d0d8992e610d85")
        .send({
          phoneNumber: "987654321",
        });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.hotline).toEqual(mockHotline);
    });

    it("should return 404 if hotline not found", async () => {
      Hotline.findByIdAndUpdate.mockResolvedValue(null);
      const res = await request(app)
        .patch("/hotlines/60d21b4667d0d8992e610d85")
        .send({
          phoneNumber: "987654321",
        });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("Hotline not found");
    });
  });

  describe("delete hotline", () => {
    it("should return 200 and success message if hotline deleted", async () => {
      const mockHotline = {
        _id: "60d21b4667d0d8992e610d85",
        phoneNumber: "123456789",
      };
      Hotline.findByIdAndDelete.mockResolvedValue(mockHotline);
      const res = await request(app).delete(
        "/hotlines/60d21b4667d0d8992e610d85"
      );
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.info).toBe("Hotline deleted successfully");
      expect(res.body.hotline).toEqual(mockHotline);
    });

    it("should return 404 if hotline not found", async () => {
      Hotline.findByIdAndDelete.mockResolvedValue(null);
      const res = await request(app).delete(
        "/hotlines/60d21b4667d0d8992e610d85"
      );
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("Hotline not found");
    });
  });
});
