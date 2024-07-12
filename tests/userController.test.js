const request = require("supertest");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const userController = require("../controllers/user"); // Adjust the path as necessary
const User = require("../models/user");

// Mock the User model
jest.mock("../models/user");

const app = express();
app.use(express.json());

// Define the routes
app.post("/users/", userController.addUser);
app.get("/users/:id", userController.getUser);
app.patch("/users/:id", userController.updateUser);

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addUser", () => {
    it("should return 201 and saved user", async () => {
      const mockUser = {
        _id: "60d21b4667d0d8992e610d85",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
      };
      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockUser),
      }));
      const res = await request(app).post("/users").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
      });
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body).toEqual(mockUser);
    });

    it("should return 400 if email already exists", async () => {
      const existingUser = {
        email: "john.doe@example.com",
      };
      User.findOne.mockResolvedValue(existingUser);
      const res = await request(app).post("/users").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
      });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Email already in use");
    });
  });

  describe("getUser", () => {
    it("should return 200 and the user object", async () => {
      const mockUser = {
        _id: "60d21b4667d0d8992e610d85",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
      };
      User.findById.mockResolvedValue(mockUser);
      const res = await request(app).get("/users/60d21b4667d0d8992e610d85");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual(mockUser);
    });

    it("should return 404 if user not found", async () => {
      User.findById.mockResolvedValue(null);
      const res = await request(app).get("/users/60d21b4667d0d8992e610d85");
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("updateUser", () => {
    it("should return 200 and updated user object", async () => {
      const updatedUser = {
        firstName: "Jane",
        lastName: "Doe",
        phoneNumber: "0987654321",
      };
      User.findByIdAndUpdate.mockResolvedValue(updatedUser);
      const res = await request(app)
        .patch("/users/60d21b4667d0d8992e610d85")
        .send(updatedUser);
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toEqual(updatedUser);
    });

    it("should return 404 if user not found", async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
      const res = await request(app)
        .patch("/users/60d21b4667d0d8992e610d85")
        .send({
          firstName: "Jane",
        });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("User not found");
    });
  });
});
