import { Router } from "express";
import * as blogController from "../controllers/blog.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { logger } from "../utils/logger.js";


const blogRoute = Router();

//create
blogRoute.post("/", authMiddleware, (req, res) => {
    logger.info("POST /blogs requested");
    blogController.createBlog(req, res);
});


//update
blogRoute.put("/:id", authMiddleware, (req, res) => {
    logger.info("PUT /blogs/${req.params.id} requested");
    blogController.updateBlog(req, res);
});



//update
blogRoute.put("/:id/state", authMiddleware, (req, res) => {
    logger.info("PUT /blog/${req.params.id} requested.");
    blogController.updateBlogState(req, res);
  });


  //delete
blogRoute.delete("/:id", authMiddleware, (req, res) => {
    logger.info("DELETE /blogs/${req.params.id} requested");
    blogController.deleteBlog(req, res);
});



//read
blogRoute.get("/", (req, res) => {
    logger.info("GET /blogs requested.");
    blogController.getAllBlogs(req, res);
  });


  //read
  blogRoute.get("/:id", (req, res) => {
    logger.info(`GET /blogs/${req.params.id} requested.`);
    blogController.getBlogById(req, res);
  });




export default blogRoute;