const userModel=require("../models/user.model");

function userRegister(req,res){
    const {email,name,password}=req.body;
    if(!email || !name || !password){
        return res.status(400).json({message:"Please fill in all the fields"});
    }
}
module.exports={userRegister};