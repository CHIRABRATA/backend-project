const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendRegistrationEmail } = require("../services/email.service");
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
            { expiresIn: "3d" }
        );

        // 5. Set Cookie (Optional but good practice)
        res.cookie("token", token, {
            httpOnly: true, // Prevents XSS attacks
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        });
        // Send registration email
        await sendRegistrationEmail(newUser.email, newUser.name);  

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
//user login funtion when user hit /api/auth/login then this
//  function will be called and it will check the email and password and 
// if they are correct then it will generate a token and send it to the client
async function userlogin(req,res){
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 2. Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Generate Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        // 4. Set Cookie (Optional but good practice)
        res.cookie("token", token, {
            httpOnly: true, // Prevents XSS attacks
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        });
        

        // 5. Send ONE final response
        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
async function userlogout(req,res){
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = { userRegister, userlogin };