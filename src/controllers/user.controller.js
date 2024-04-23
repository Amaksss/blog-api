import * as userService from "../services/user.service.js";

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const newUser = await userService.register(firstName, lastName, email, password);
        res.json({
            message: "User created successfully",
            data: {
                user: newUser,
            },
        });
    }
    catch (err) {
        res.status( err.status || 500 );
        res.json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await userService.login(email, password);
        res.json({
            message: "Login Successful",
            data: {
                accessToken: token,
            },
        });
    }
    catch(err) {
        res.status( err.status || 500 );
        res.json({ message: err.message });
    }
}