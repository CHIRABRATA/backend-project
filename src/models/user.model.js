const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please fill in your email"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    name: {
        type: String,
        required: [true, "Please fill in your name"],
        trim: true,
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

// FIXED: Removed 'next' to support modern Mongoose async hooks
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    try {
        this.password = await bcrypt.hash(this.password, 12);
    } catch (error) {
        throw error; // Mongoose will catch this as a rejection
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);