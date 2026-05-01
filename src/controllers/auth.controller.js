const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function userRegister(req, res) {
    try {
        const { email, name, password } = req.body;

        // 1. Validation
        if (!email || !name || !password) {
            return res.status(400).json({ message: "Please fill in all the fields" });
        }

        // 2. Check if user exists
        const isExist = await userModel.findOne({ email });
        if (isExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 3. Create new user (using Option B since you used .save() below)
        const newUser = new userModel({
            email,
            name,
            password // Remember: your schema's .pre("save") will hash this
        });

        await newUser.save();

        // 4. Generate Token
        const token = jwt.sign(
            { id: newUser._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        // 5. Set Cookie (Optional but good practice)
        res.cookie("token", token, {
            httpOnly: true, // Prevents XSS attacks
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // 6. Send ONE final response
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { userRegister };