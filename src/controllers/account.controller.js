const accountModel = require("../models/account.model");

async function createAccount(req, res) {
    try {
        // 1. Check if authMiddleware actually passed the user
        if (!req.user || !req.user._id) {
            return res.status(401).json({ 
                message: "Unauthorized: User data missing from request" 
            });
        }

        const userId = req.user._id;

        // 2. Check for existing account
        // Ensure 'userId' matches the field name in your account.model.js
        const existingAccount = await accountModel.findOne({ userId: userId });
        
        if (existingAccount) {
            return res.status(400).json({ 
                message: "Account already exists for this user" 
            });
        }

        // 3. Create new account
        const newAccount = new accountModel({
            userId: userId,
            balance: 0,
            status: "active",
            currency: "indian rupees"
        });

        await newAccount.save();

        // 4. Success Response
        return res.status(201).json({ 
            message: "Account created successfully", 
            account: newAccount 
        });

    } catch (error) {
        // This logs the full error to your VS Code terminal
        console.error("DETAILED ERROR:", error); 
        
        // This sends the SPECIFIC error message back to Postman
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
}
async function getuseraccountcontroller(req,res){
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User data missing" });
        }
        const account = await accountModel.findOne({userId:req.user._id});
        if(!account){
            return res.status(404).json({message:"Account not found"})
        }   
        res.status(200).json({account})
    } catch (error) {
        console.error("Error fetching account:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getUserBalance(req,res){
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User data missing" });
        }
        const account = await accountModel.findOne({userId:req.user._id});
        if(!account){
            return res.status(404).json({message:"Account not found"})
        }
        const balance = await account.getBalance();
        return res.status(200).json({balance})
    } catch (error) {
        console.error("Error fetching balance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Ensure this matches how you import it in your routes!
module.exports = { createAccount, getuseraccountcontroller, getUserBalance };