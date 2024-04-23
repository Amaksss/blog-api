import * as blogService from "../services/blog.services.js"


//get a list of published blogs with pagination, filtering, searching and ordering
export const publishedBlogs = async (req, res) => {
    try {
        const blogs = await blogService.publishedBlogs();
        res.json(blogs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
};





export const getBlogById = async (req, res) => {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      res.json(blog);
    } catch (error) {
      res.json({ message: error.message });
    }
  };
 

//create a new blog
export const createBlog = async (req, res) => {
    try {
        //const { title, description, tags, body } = req.body;
        // const userId = req.user._id;
        const blog = await blogService.createBlog( req.body, req.user.id);
        res.status(201).json({ message: "Blog created", data: { blog }});
    }
    catch (error) {
        res.status(500).json({ message: error.message });
      }
};


//update blog state from draft to published

const updatedBlogState = async (req, res) => {
    try {
      const blogId = req.params;
      const userId = req.user.id;
      const newState = req.body.state;
      const updatedBlog = await blogService.updatedBlogState(
        blogId,
        userId,
        newState
      );
      res.json(updatedBlog);
    } catch (error) {
      res.json({ message: error.message });
    }
  };


//update blog details
export const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;
        const updatedBlog = await blogService.updateBlog(blogId, userId, req.body);
        res.json(updatedBlog);
    }
    catch (err) {
        res.status( err.status || 500 );
        res.json({ message: err.message });
    }

};


//delete blog
export const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;
        await blogService.deleteBlog(blogId, userId);
        res.json ({ message: "Blog deleted successfully"})
    }
    catch (err) {
        res.status( err.status || 500 );
        res.json({ message: err.message });
    }
}


//get list of users blogs
export const getUserBlogs = async (req, res) => {
    try {
        const userId = req.user._id;
        const userBlogs = await blogService.getUserBlogs(userId);
        res.json(userBlogs);
    }
    catch (err) {
        res.status( err.status || 500 );
        res.json({ message: err.message });
    } 
};


export const getAllBlogs = async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const pageSize = +req.query.pageSize || 20;
  
      const blogs = await blogService.getAllBlogs({ page, pageSize });
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


