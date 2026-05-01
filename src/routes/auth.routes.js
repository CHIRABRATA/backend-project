const express=require("express");   
const { route } = require("../app");
const router=express.Router();

router.post("/register",userRegister);



module.exports=router;