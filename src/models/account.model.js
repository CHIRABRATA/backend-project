const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");


const accountSchema = new mongoose.Schema({
    userId: {
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
accountSchema.index({ userId: 1, status: 1 }); // Create an index on the userId field for faster queries
accountSchema.methods.getBalance = async function () {
   const balance = await ledgerModel.aggregate([
        { $match: { accountId: this._id } },
        { $group: { _id: null, totalBalance: { $sum: "$balanceAfterTranscation" } } }
    ]);
    return balance.length > 0 ? balance[0].totalBalance : 0;  
};
const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;