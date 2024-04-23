import * as blogService from "../services/blog.services.js";
import Blog from "../database/schema/blog.schema.js";

jest.mock("../database/schema/blog.schema.js");

describe("blogService", () => {
  describe("publishedBlogs", () => {
    it("should return published blogs with pagination and search criteria", async () => {
      const mockBlogs = [
        { title: "Blog 1", state: "published" },
        { title: "Blog 2", state: "published" },
      ];
      const mockOptions = { page: 1, limit: 10, state: "published", search: "keyword", sortBy: "-timestamp" };

      Blog.find.mockResolvedValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBlogs),
        populate: jest.fn().mockReturnThis(),
      });

      const result = await blogService.publishedBlogs(mockOptions);

      expect(Blog.find).toHaveBeenCalledWith({ state: "published", $or: [{ author: { $regex: "keyword", $options: "i" } }, { title: { $regex: "keyword", $options: "i" } }, { tags: { $regex: "keyword", $options: "i" } }] });
      expect(result).toEqual(mockBlogs);
    });
  });

  describe("getBlogById", () => {
    it("should return a blog by ID", async () => {
      const mockBlog = { _id: "blogId", title: "Test Blog", state: "published" };

      Blog.findById.mockResolvedValue(mockBlog);

      const result = await blogService.getBlogById("blogId");

      expect(Blog.findById).toHaveBeenCalledWith("blogId");
      expect(result).toEqual(mockBlog);
    });

    it("should throw an error if blog not found", async () => {
      Blog.findById.mockResolvedValue(null);

      await expect(blogService.getBlogById("nonExistentId")).rejects.toThrow("Blog not found");
    });
  });

  describe("createBlog", () => {
    it("should create a new blog", async () => {
      const mockBlogData = { title: "New Blog", description: "Test description", tags: ["tag1", "tag2"], body: "Test body", author: "authorId" };
      const mockCreatedBlog = { _id: "newBlogId", ...mockBlogData };

      Blog.mockImplementation(() => mockCreatedBlog);
      const saveMock = jest.fn().mockResolvedValue(mockCreatedBlog);
      Blog.prototype.save = saveMock;

      const result = await blogService.createBlog(mockBlogData, "authorId");

      expect(Blog).toHaveBeenCalledWith(mockBlogData);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedBlog);
    });
  });

  describe("updateBlogState", () => {
    it("should update blog state to 'published'", async () => {
      const mockBlogId = "blogId";
      const mockUserId = "userId";
      const mockNewState = "published";
      

      

      await blogService.updateBlogState(mockBlogId, mockUserId, mockNewState);

      expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith(mockBlogId, { state: mockNewState }, { new: true });
      
    });

    it("should throw an error if state is invalid", async () => {
      await expect(blogService.updateBlogState("blogId", "userId", "invalidState")).rejects.toThrow("Invalid state");
    });
  });

  describe("updateBlog", () => {
    it("should update a blog", async () => {
      const mockBlogId = "blogId";
      const mockUserId = "userId";
      const mockUpdatedFields = { title: "Updated Title" };
      const mockUpdatedBlog = { _id: mockBlogId, ...mockUpdatedFields };

      Blog.findById.mockResolvedValue({ author: mockUserId });
      Blog.findByIdAndUpdate.mockResolvedValue(mockUpdatedBlog);

      const result = await blogService.updateBlog(mockBlogId, mockUserId, mockUpdatedFields);

      expect(Blog.findById).toHaveBeenCalledWith(mockBlogId);
      expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith(mockBlogId, mockUpdatedFields, { new: true });
      expect(result).toEqual(mockUpdatedBlog);
    });

    it("should throw an error if blog not found", async () => {
      Blog.findById.mockResolvedValue(null);

      await expect(blogService.updateBlog("nonExistentId", "userId", {})).rejects.toThrow("Blog not found");
    });

    it("should throw an error if user is not authorized to edit the blog", async () => {
      Blog.findById.mockResolvedValue({ author: "anotherUserId" });

      await expect(blogService.updateBlog("blogId", "userId", {})).rejects.toThrow("You are not authorized to edit this blog");
    });
  });

  describe("deleteBlog", () => {
    it("should delete a blog", async () => {
      const mockBlogId = "blogId";

      Blog.findByIdAndDelete.mockResolvedValue({ _id: mockBlogId });

      const result = await blogService.deleteBlog(mockBlogId);

      expect(Blog.findByIdAndDelete).toHaveBeenCalledWith(mockBlogId);
      expect(result).toEqual({ _id: mockBlogId });
    });
  });

  describe("getUserBlogs", () => {
    it("should return blogs of a user", async () => {
      const mockUserId = "userId";
      const mockUserBlogs = [{ _id: "blogId1" }, { _id: "blogId2" }];

      Blog.find.mockResolvedValue(mockUserBlogs);

      const result = await blogService.getUserBlogs(mockUserId);

      expect(Blog.find).toHaveBeenCalledWith({ author: mockUserId });
      expect(result).toEqual(mockUserBlogs);
    });
  });

  describe("getAllBlogs", () => {
    it("should return all blogs with pagination", async () => {
      const mockPage = 1;
      const mockPageSize = 10;
      const mockBlogs = [{ _id: "blogId1" }, { _id: "blogId2" }];

      Blog.find.mockResolvedValue(mockBlogs);

      const result = await blogService.getAllBlogs(mockPage, mockPageSize);

      expect(Blog.find).toHaveBeenCalledWith().skip((mockPage - 1) * mockPageSize).limit(mockPageSize);
      expect(result).toEqual(mockBlogs);
    });
  });
});