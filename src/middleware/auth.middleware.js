import jwt from "jsonwebtoken";
import User from "../database/schema/user.schema.js";
import Blog from "../database/schema/blog.schema.js";


export const authMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("Authorization", authorization);


    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) { 
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "unauthorized, Invalid token"});
        }

        req.user = user;
        next()
    }
    catch (error) {
        res.status(401).json({ message: "unauthorized"});
    }
};