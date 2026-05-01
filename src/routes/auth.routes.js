const express=require("express");   
const { route } = require("../app");
const router=express.Router();
const {userRegister}=require("../controllers/auth.controller");

router.post("/register",userRegister);


module.exports=router;