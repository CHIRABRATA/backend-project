const transcationService = require("../services/transcation.service");
const legerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const transcationModel = require("../models/transcation.model");
async function createTranscation(req, res) {
    try {
        const { amount, type, fromaccountId,toaccountId,idempotencykey } = req.body;

        const transcation = await transcationService.createTranscation({ amount, type, fromaccountId,toaccountId,idempotencykey });

        res.status(201).json(transcation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const fromUseraccount= await accountModel.findById(fromaccountId)({
    id: fromAccountId,
    balance: fromUseraccount.balance,
    status: fromUseraccount.status,
    currency: fromUseraccount.currency
})
const toUseraccount= await accountModel.findById(toaccountId)({
    id: toaccountId,
    balance: toUseraccount.balance,
})
if(!fromUseraccount || fromUseraccount.status !== "active"){
    return res.status(400).json({message:"From account is not active or does not exist"})
}


module.exports = { createTranscation };