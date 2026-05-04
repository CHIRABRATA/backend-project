const express = require('express');
const router = express.Router();
const authMiddleware=require('../middleware/auth.middleware');
const { createTranscation, getTransactionHistory } = require('../controllers/transcaction.controller');

// Create transaction
//api/transcation/bank - POST to create new transaction
router.post('/bank', authMiddleware, createTranscation);

// Get transaction history
//api/transcation/history - GET to view all transactions
router.get('/history', authMiddleware, getTransactionHistory);

module.exports = router;