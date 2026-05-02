const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    useerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true // using b+tree index for faster lookups
    },
    balance: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    currency: {
        type: String,
        default: "indian rupees"
    }

},);
accountSchema.index({ useerId: 1,status: 1 }); // Create an index on the userId field for faster queries

const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;