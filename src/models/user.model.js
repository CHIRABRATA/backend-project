const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please fill in your email"],
        trim: true,
        lowercase: true,
        unique: true, // Defines an index in MongoDB
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    name: {
        type: String,
        required: [true, "Please fill in your name"]
        
    },
    password: {
        type: String,
        required: [true, "Please fill in your password"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre("save", async function (next) {// Pre-save hook to hash the password before saving the user document
    if (!this.isModified("password")) {// If the password field is not modified, skip hashing and move to the next middleware
        return next();
    }
    
    try {
        this.password = await bcrypt.hash(this.password, 12);// Hash the password with a salt round of 12
        next();
    } catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = async function (candidatePassword) {// Method to compare the provided password with the hashed password in the database
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;