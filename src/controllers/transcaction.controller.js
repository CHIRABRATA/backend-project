const accountModel = require("../models/account.model");
const transcationModel = require("../models/transcation.model");
const ledgerModel = require("../models/ledger.model");
const { v4: uuidv4 } = require("uuid");

/**
 * Create a bank transfer/transaction
 * Transfers money from one account to another and updates ledger
 * 
 * Request body:
 * {
 *   "toAccountId": "account_id_of_receiver",
 *   "amount": 500,
 *   "description": "Payment for services"
 * }
 */
async function createTranscation(req, res) {
    try {
        // 1. Get logged-in user's account (sender)
        const fromAccount = await accountModel.findOne({ userId: req.user._id });
        if (!fromAccount) {
            return res.status(404).json({ message: "Your account not found" });
        }

        const { toAccountId, amount, description } = req.body;

        // 2. Validate input
        if (!toAccountId || !amount || !description) {
            return res.status(400).json({ 
                message: "Please provide toAccountId, amount, and description" 
            });
        }

        if (amount <= 0) {
            return res.status(400).json({ 
                message: "Amount must be greater than 0" 
            });
        }

        // 3. Check if recipient account exists
        const toAccount = await accountModel.findById(toAccountId);
        if (!toAccount) {
            return res.status(404).json({ 
                message: "Recipient account not found" 
            });
        }

        // 4. Check if sender and receiver are different
        if (fromAccount._id.toString() === toAccount._id.toString()) {
            return res.status(400).json({ 
                message: "Cannot transfer money to the same account" 
            });
        }

        // 5. Verify both accounts are active
        if (fromAccount.status !== "active") {
            return res.status(400).json({ 
                message: "Your account is not active" 
            });
        }

        if (toAccount.status !== "active") {
            return res.status(400).json({ 
                message: "Recipient account is not active" 
            });
        }

        // 6. Check sufficient balance in sender's account
        const senderBalance = await fromAccount.getBalance();
        if (senderBalance < amount) {
            return res.status(400).json({ 
                message: "Insufficient balance",
                currentBalance: senderBalance,
                requiredAmount: amount
            });
        }

        // 7. Create transaction record (idempotency key prevents duplicate processing)
        const idempotencyKey = uuidv4();
        const transaction = new transcationModel({
            fromaccountId: fromAccount._id,
            toaccountId: toAccount._id,
            amount: amount,
            description: description,
            status: "completed",
            idempotencyKey: idempotencyKey
        });

        await transaction.save();

        // 8. Update ledger for sender (debit)
        const senderNewBalance = senderBalance - amount;
        const senderLedger = new ledgerModel({
            accountId: fromAccount._id,
            transcationId: transaction._id,
            amount: amount,
            type: "debit",
            balanceAfterTranscation: senderNewBalance,
            description: `Sent to account ${toAccount._id}: ${description}`
        });

        await senderLedger.save();

        // 9. Update ledger for receiver (credit)
        const receiverBalance = await toAccount.getBalance();
        const receiverNewBalance = receiverBalance + amount;
        const receiverLedger = new ledgerModel({
            accountId: toAccount._id,
            transcationId: transaction._id,
            amount: amount,
            type: "credit",
            balanceAfterTranscation: receiverNewBalance,
            description: `Received from account ${fromAccount._id}: ${description}`
        });

        await receiverLedger.save();

        // 10. Success response
        return res.status(201).json({
            message: "Transaction completed successfully",
            transaction: {
                transactionId: transaction._id,
                from: fromAccount._id,
                to: toAccount._id,
                amount: amount,
                description: description,
                status: transaction.status,
                senderNewBalance: senderNewBalance,
                receiverNewBalance: receiverNewBalance,
                timestamp: transaction._id.getTimestamp()
            }
        });

    } catch (error) {
        console.error("Transaction error:", error);
        
        // Handle duplicate idempotency key
        if (error.code === 11000) {
            return res.status(409).json({ 
                message: "Duplicate transaction - this request has already been processed" 
            });
        }

        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}

/**
 * Get transaction history
 */
async function getTransactionHistory(req, res) {
    try {
        const account = await accountModel.findOne({ userId: req.user._id });
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        const transactions = await transcationModel.find({
            $or: [
                { fromaccountId: account._id },
                { toaccountId: account._id }
            ]
        }).sort({ _id: -1 }); // Most recent first

        return res.status(200).json({
            message: "Transaction history retrieved",
            transactions: transactions
        });

    } catch (error) {
        console.error("Error fetching transaction history:", error);
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}

module.exports = { createTranscation, getTransactionHistory };