import jwt from "jsonwebtoken";
import  User from "../database/schema/user.schema.js";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
    return jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

export const register = async(firstName, lastName, email, password) => {
    const existingUser = await User.findOne ({ email });
    if (existingUser) {
        throw new Error ("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User ({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });
    await user.save();
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    };
};


export const login = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error ("User not found");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) {
        throw new Error ("Invalid password");
    }
    const token = generateToken(user);
    return { user, token};
};