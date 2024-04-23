import Blog from "../database/schema/blog.schema.js";

export const publishedBlogs = async ({ page = 1, limit = 20, state = 'published' || 'draft', search, sortBy }) => {
    const skip = (page - 1) * limit;
    const searchCriteria = search ? {
      $or: [
        { author: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ]
    } : {};
    const sort = sortBy || '-timestamp';
  
    return Blog.find({ state, ...searchCriteria })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('author', 'firstName lastName');
  };
  
  

  export const getBlogById = async (id) => {
    try {
      const blog = await Blog.findById(id);
  
      if (!blog) {
        throw new Error("Blog not found");
      }
  
      blog.read_count++;
      await blog.save();
  
      return blog;
    } catch (error) {
      throw error;
    }
  };
  
 

  export const createBlog = async(blogData, userId) => {
    const { title, description, tags, body } = blogData;
    const blog = new Blog ({ title, description, body, tags, author: userId });
    await blog.save();
    return blog;
 };
  


 export const updatedBlogState = async (blogId, userId, newState) => {
    if (newState !== "published") {
      throw new Error("Invalid state");
    }
    return Blog.findByIdAndUpdate(
      blogId,
      userId,
      { state: newState },
      { new: true }
    );
  };

  


  
  export const updateBlog = async (blogId, userId, updatedFields) => {
    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.json("Blog not found")
        }

        if (blog.author.toString() !== userId) {
            throw new Error("You are not authorized to edit this blog");
        }
        
        if (updatedFields.body) {
            updatedFields.reading_time = calculateReadingTime(updatedFields.body);
        }

        return await Blog.findByIdAndUpdate(blogId, updatedFields, { new: true });
    }
    catch(error) {
        throw new Error(error.message);
    }
   
  };
  
  export const deleteBlog = async (blogId, userId) => {
    return Blog.findByIdAndDelete(blogId);
  };
  
  export const getUserBlogs = async (userId) => {
    return Blog.find({ author: userId });
  };

  export const getAllBlogs = async (page, pageSize) => {
    const skip = (page - 1) * pageSize;
    const blogs = await Blog.find().skip(skip).limit(pageSize);
  
    return blogs;
  };