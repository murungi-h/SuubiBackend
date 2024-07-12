const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const eventController = require("../controllers/event");
const Event = require("../models/event");

// Mock the Event model
jest.mock("../models/event");

const app = express();
app.use(express.json());

// Define the routes
app.get("/events", eventController.getEvents);
app.post("/events", eventController.addEvent);
app.put("/events/:id", eventController.updateEvent);

describe("Event Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getEvents", () => {
    it("should return 400 if supportGroupId is invalid", async () => {
      const res = await request(app)
        .get("/events")
        .query({ supportGroupId: "invalidId" });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid support Group id");
    });

    it("should return 404 if no events found for a valid supportGroupId", async () => {
      Event.find.mockResolvedValue([]);
      const res = await request(app)
        .get("/events")
        .query({ supportGroupId: "60d21b4667d0d8992e610c85" });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.info).toBe("No events available");
    });

    it("should return 200 and events for a valid supportGroupId", async () => {
      const mockEvents = [
        { _id: "60d21b4667d0d8992e610c85", title: "Event 1" },
        { _id: "60d21b4667d0d8992e610c86", title: "Event 2" },
      ];
      Event.find.mockResolvedValue(mockEvents);
      const res = await request(app)
        .get("/events")
        .query({ supportGroupId: "60d21b4667d0d8992e610c85" });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.events).toEqual(mockEvents);
    });
  });

  describe("addEvent", () => {
    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/events").send({});
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Please provide event details");
    });

    it("should return 400 if supportGroupId is invalid", async () => {
      const res = await request(app).post("/events").send({
        supportGroupId: "invalidId",
        date: "2024-07-15",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        location: "Sample Location",
        title: "Event 1",
        description: "Description of Event 1",
        image: "event1.jpg",
      });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid support group id");
    });

    it("should return 201 and save event if valid", async () => {
      const mockEvent = {
        _id: "60d21b4667d0d8992e610c85",
        title: "Event 1",
      };
      Event.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockEvent),
      }));
      const res = await request(app).post("/events").send({
        supportGroupId: "60d21b4667d0d8992e610c85",
        date: "2024-07-15",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        location: "Sample Location",
        title: "Event 1",
        description: "Description of Event 1",
        image: "event1.jpg",
      });
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body.event).toEqual(mockEvent);
    });
  });

  describe("updateEvent", () => {
    it("should return 400 if id is invalid", async () => {
      const res = await request(app)
        .put("/events/invalidId")
        .send({ title: "Updated Event" });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid id");
    });

    it("should return 404 if event not found", async () => {
      Event.findByIdAndUpdate.mockResolvedValue(null);
      const res = await request(app)
        .put("/events/60d21b4667d0d8992e610c85")
        .send({ title: "Updated Event" });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("Event not found");
    });

    it("should return 200 and update event if valid", async () => {
      const mockEvent = {
        _id: "60d21b4667d0d8992e610c85",
        title: "Updated Event",
      };
      Event.findByIdAndUpdate.mockResolvedValue(mockEvent);
      const res = await request(app)
        .put("/events/60d21b4667d0d8992e610c85")
        .send({ title: "Updated Event" });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.event).toEqual(mockEvent);
    });
  });
});
