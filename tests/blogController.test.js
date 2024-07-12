const request = require("supertest");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const blogController = require("../controllers/blog");
const Blog = require("../models/Blog");

// Mock the Blog model
jest.mock("../models/Blog");

const app = express();
app.use(express.json());

// Define the routes
app.get("/blogs/:id", blogController.getBlog);
app.get("/blogs/", blogController.getBlogs);
app.post("/blogs/", blogController.addBlog);
app.put("/blogs/:id", blogController.updateBlog);
app.delete("/blogs/:id", blogController.deleteBlog);

describe("Blog Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBlog", () => {
    it("should return 400 if id is invalid", async () => {
      const res = await request(app).get("/blogs/invalidId");
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid id");
    });

    it("should return 404 if blog not found", async () => {
      Blog.findById.mockResolvedValue(null);
      const res = await request(app).get("/blogs/60d21b4667d0d8992e610c85");
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("No blog with id : 60d21b4667d0d8992e610c85");
    });

    it("should return 200 if blog found", async () => {
      const mockBlog = { _id: "60d21b4667d0d8992e610c85", title: "Test Blog" };
      Blog.findById.mockResolvedValue(mockBlog);
      const res = await request(app).get("/blogs/60d21b4667d0d8992e610c85");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.blog).toEqual(mockBlog);
    });
  });

  describe("getBlogs", () => {
    it("should return 200 with no blogs available", async () => {
      Blog.find.mockResolvedValue([]);
      const res = await request(app).get("/blogs");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.info).toBe("No blogs available");
    });

    it("should return 200 with blogs", async () => {
      const mockBlogs = [
        { _id: "60d21b4667d0d8992e610c85", title: "Test Blog" },
      ];
      Blog.find.mockResolvedValue(mockBlogs);
      const res = await request(app).get("/blogs");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.blogs).toEqual(mockBlogs);
    });
  });

  describe("addBlog", () => {
    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/blogs").send({});
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Please provide blog body");
    });

    it("should return 400 if facilityId is invalid", async () => {
      const res = await request(app).post("/blogs").send({
        title: "Test Blog",
        content: "Test Content",
        author: "Author",
        date: "2021-01-01",
        facilityId: "invalidId",
      });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid facility id");
    });

    it("should return 201 and save blog if valid", async () => {
      const mockBlog = { _id: "60d21b4667d0d8992e610c85", title: "Test Blog" };
      Blog.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockBlog),
      }));
      const res = await request(app).post("/blogs").send({
        title: "Test Blog",
        content: "Test Content",
        author: "Author",
        date: "2021-01-01",
        facilityId: "60d21b4667d0d8992e610c85",
      });
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body.blog).toEqual(mockBlog);
    });
  });

  describe("updateBlog", () => {
    it("should return 400 if id is invalid", async () => {
      const res = await request(app)
        .put("/blogs/invalidId")
        .send({ title: "New Title" });
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid id");
    });

    it("should return 404 if blog not found", async () => {
      Blog.findByIdAndUpdate.mockResolvedValue(null);
      const res = await request(app)
        .put("/blogs/60d21b4667d0d8992e610c85")
        .send({ title: "New Title" });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("Blog not found");
    });

    it("should return 200 and update blog if valid", async () => {
      const mockBlog = {
        _id: "60d21b4667d0d8992e610c85",
        title: "Updated Blog",
      };
      Blog.findByIdAndUpdate.mockResolvedValue(mockBlog);
      const res = await request(app)
        .put("/blogs/60d21b4667d0d8992e610c85")
        .send({ title: "Updated Blog" });
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.blog).toEqual(mockBlog);
    });
  });

  describe("deleteBlog", () => {
    it("should return 400 if id is invalid", async () => {
      const res = await request(app).delete("/blogs/invalidId");
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe("Invalid id");
    });

    it("should return 404 if blog not found", async () => {
      Blog.findByIdAndDelete.mockResolvedValue(null);
      const res = await request(app).delete("/blogs/60d21b4667d0d8992e610c85");
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
      expect(res.body.error).toBe("Blog not found");
    });

    it("should return 200 and delete blog if valid", async () => {
      const mockBlog = {
        _id: "60d21b4667d0d8992e610c85",
        title: "Deleted Blog",
      };
      Blog.findByIdAndDelete.mockResolvedValue(mockBlog);
      const res = await request(app).delete("/blogs/60d21b4667d0d8992e610c85");
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.blog).toEqual(mockBlog);
    });
  });
});
