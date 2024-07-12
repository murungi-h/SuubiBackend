const request = require("supertest");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const supportGroupController = require("../controllers/supportGroup");
const SupportGroup = require("../models/supportGroup");

// Mock the SupportGroup model
jest.mock("../models/supportGroup");

const app = express();
app.use(express.json());

// Define the routes
app.get("/supportGroups/", supportGroupController.getSupportGroups);
app.post("/supportGroups/", supportGroupController.addSupportGroup);
app.patch("/supportGroups/:id", supportGroupController.updateSupportGroup);

describe("SupportGroup Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("get all support groups", () => {
    it("should return 200 and list of support groups", async () => {
      const mockSupportGroups = [
        { _id: "60d21b4667d0d8992e610d85", name: "Group A" },
        { _id: "60d21b4667d0d8992e610d86", name: "Group B" },
      ];
      SupportGroup.find.mockResolvedValue(mockSupportGroups);
      const res = await request(app).get("/supportGroups");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.supportGroups).toEqual(mockSupportGroups);
    });

    it("should return 200 with 'No support groups available' message if no support groups found", async () => {
      SupportGroup.find.mockResolvedValue([]);
      const res = await request(app).get("/supportGroups");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.info).toBe("No support groups available");
    });
  });

  describe("add support group", () => {
    it("should return 201 and saved support group", async () => {
      const mockSupportGroup = {
        _id: "60d21b4667d0d8992e610d85",
        name: "Group A",
      };
      SupportGroup.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSupportGroup),
      }));
      const res = await request(app).post("/supportGroups").send({
        name: "Group A",
        facilityId: "60d21b4667d0d8992e610c85",
        members: [],
        description: "A support group",
      });
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body.supportGroup).toEqual(mockSupportGroup);
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/supportGroups").send({});
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Please provide all support group details");
    });
  });

  describe("update support group", () => {
    it("should return 200 and updated support group", async () => {
      const mockSupportGroup = {
        _id: "60d21b4667d0d8992e610d85",
        name: "Updated Group A",
      };
      SupportGroup.findByIdAndUpdate.mockResolvedValue(mockSupportGroup);
      const res = await request(app)
        .patch("/supportGroups/60d21b4667d0d8992e610d85")
        .send({
          name: "Updated Group A",
          description: "An updated support group",
        });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.supportGroup).toEqual(mockSupportGroup);
    });

    it("should return 404 if support group not found", async () => {
      SupportGroup.findByIdAndUpdate.mockResolvedValue(null);
      const res = await request(app)
        .patch("/supportGroups/60d21b4667d0d8992e610d85")
        .send({
          name: "Nonexistent Group",
        });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("Support group not found");
    });
  });
});
