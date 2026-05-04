const {router} = require('express');
const authMiddleware=require('../middleware/auth.middleware');
const {transcationModel}=require('../models/transcation.model');
const accountModel=require('../models/account.model');
const ledgerModel=require('../models/ledger.model');

const transcationRouter=router();

// Create
//api/transcation
transcationRouter.post('/bank',authMiddleware);
module.exports=transcationRouter;