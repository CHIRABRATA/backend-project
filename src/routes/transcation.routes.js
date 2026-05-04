const express = require('express');
const router = express.Router();
const authMiddleware=require('../middleware/auth.middleware');

// TODO: Implement transaction controller
// const { createTransaction } = require('../controllers/transcaction.controller');

// Create
//api/transcation/bank
// router.post('/bank', authMiddleware, createTransaction);

module.exports = router;