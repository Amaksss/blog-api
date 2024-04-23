import mongoose from "mongoose";

export const connect = async () => {
    const { MONGODB_URL } = process.env;

    if (MONGODB_URL) {
        return await mongoose.connect(MONGODB_URL)
    }
};