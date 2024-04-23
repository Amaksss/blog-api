import mongoose from "mongoose";

//schema

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    state: {
        type: String,
        enum: [ 'draft', 'published'],
        default: 'draft',
    },
    readCount: {
        type: Number,
        default: 0,
    },
    readingTime: {
        type: Number,
    },
    tags: {
        type: [String],
        default: []
    },
    body: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        default: Date.now()
    }
});


//model
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;