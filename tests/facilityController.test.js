const request = require("supertest");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const facilityController = require("../controllers/facility");
const Facility = require("../models/facility");

// Mock the Facility model
jest.mock("../models/facility");

const app = express();
app.use(express.json());

// Define the routes
app.get("/facilities/", facilityController.getFacilities);
app.post("/facilities/", facilityController.addFacility);
app.get("/facilities/:id", facilityController.getFacility);
app.patch("/facilities/:id", facilityController.updateFacility);

describe("Facility Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("get all facilities", () => {
    it("should return 200 and list of facilities", async () => {
      const mockFacilities = [
        { _id: "60d21b4667d0d8992e610c85", name: "Facility 1" },
        { _id: "60d21b4667d0d8992e610c86", name: "Facility 2" },
      ];
      Facility.find.mockResolvedValue(mockFacilities);
      const res = await request(app).get("/facilities");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.facilities).toEqual(mockFacilities);
    });

    it("should return 200 with 'No facilities available' message if no facilities found", async () => {
      Facility.find.mockResolvedValue([]);
      const res = await request(app).get("/facilities");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.info).toBe("No facilities available");
    });
  });

  describe("add facility", () => {
    it("should return 201 and saved facility", async () => {
      const mockFacility = {
        _id: "60d21b4667d0d8992e610c85",
        name: "New Facility",
      };
      Facility.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockFacility),
      }));
      const res = await request(app).post("/facilities").send({
        name: "New Facility",
        location: "Location",
        phone: "1234567890",
      });
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body.facility).toEqual(mockFacility);
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/facilities").send({});
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Please provide facility details");
    });
  });

  describe("get facility details", () => {
    it("should return 200 and facility if found", async () => {
      const mockFacility = {
        _id: "60d21b4667d0d8992e610c85",
        name: "Facility 1",
      };
      Facility.findById.mockResolvedValue(mockFacility);
      const res = await request(app).get(
        "/facilities/60d21b4667d0d8992e610c85"
      );
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.facility).toEqual(mockFacility);
    });

    it("should return 404 if facility not found", async () => {
      Facility.findById.mockResolvedValue(null);
      const res = await request(app).get(
        "/facilities/60d21b4667d0d8992e610c85"
      );
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe(
        "No facility with id : 60d21b4667d0d8992e610c85"
      );
    });

    it("should return 400 if id is invalid", async () => {
      const res = await request(app).get("/facilities/invalidId");
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid facility id");
    });
  });

  describe("update facility details", () => {
    it("should return 200 and updated facility", async () => {
      const mockFacility = {
        _id: "60d21b4667d0d8992e610c85",
        name: "Updated Facility",
      };
      Facility.findByIdAndUpdate.mockResolvedValue(mockFacility);
      const res = await request(app)
        .patch("/facilities/60d21b4667d0d8992e610c85")
        .send({ name: "Updated Facility" });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.facility).toEqual(mockFacility);
    });

    it("should return 404 if facility not found", async () => {
      Facility.findByIdAndUpdate.mockResolvedValue(null);
      const res = await request(app)
        .patch("/facilities/60d21b4667d0d8992e610c85")
        .send({ name: "Updated Facility" });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("Facility not found");
    });

    it("should return 400 if id is invalid", async () => {
      const res = await request(app)
        .patch("/facilities/invalidId")
        .send({ name: "Updated Facility" });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid facility id");
    });
  });
});
