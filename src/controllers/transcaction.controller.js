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
//validate idempotency key
const existingTranscation = await transcationModel.findOne({
    idempotencykey: idempotencykey
});
if(existingTranscation){
if(existingTranscation.status === "success"){
    return res.status(200).json(existingTranscation);
}else if(existingTranscation.status === "pending"){
    return res.status(202).json({message:"Transcation is still pending"})
}else{
    return res.status(400).json({message:"Transcation failed previously, please try again"})
}   
}
if(!toUseraccount || toUseraccount.status !== "active"){
    return res.status(400).json({message:"To account is not active or does not exist"})
}

// trnascation check
const session = await mongoose.startSession();
try {
    session.startTransaction();
    // Debit from the sender's account
    fromUseraccount.balance -= amount;
    await fromUseraccount.save({ session });
    // Credit to the receiver's account
    toUseraccount.balance += amount;
    await toUseraccount.save({ session });
    // Create a transaction record
    const transcation = new transcationModel({
        fromaccountId,
        toaccountId,
        amount,
        description: `Transfer from ${fromaccountId} to ${toaccountId}`,
        status: "completed",
        idempotencyKey: idempotencykey
    });
    await transcation.save({ session });
    const debitLedgerEntry = new legerModel({
        accountId: fromaccountId,
        amount: -amount,  
        balanceAfterTranscation: fromUseraccount.balance,
        description: `Debited ${amount} for transfer to account ${toaccountId}`
    });
    await debitLedgerEntry.save({ session });

    const creditLedgerEntry = new legerModel({
        accountId: toaccountId,
        amount: amount,
        balanceAfterTranscation: toUseraccount.balance,
        description: `Credited ${amount} for transfer from account ${fromaccountId}`
    });
    await creditLedgerEntry.save({ session });

    await session.commitTransaction();
} catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
} finally {
    await session.endSession();
}


module.exports = { createTranscation };