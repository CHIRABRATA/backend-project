const express = require("express");
const router = express.Router();

// Define your account routes here
const { createAccount, getuseraccountcontroller, getUserBalance } = require("../controllers/account.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Create a new account for the authenticated user
//api/account/create is the endpoint for creating a new account, 
// and it is protected by the authMiddleware to ensure that only authenticated users can access it.
router.post("/create", authMiddleware, createAccount);

// Get user account details
router.get("/details", authMiddleware, getuseraccountcontroller);

// Get user account balance
router.get("/balance", authMiddleware, getUserBalance);

module.exports = router;