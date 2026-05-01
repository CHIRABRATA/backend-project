const userModel=require("../models/user.model");
const jwt=require("jsonwebtoken");

async function userRegister(req,res){
    const {email,name,password}=req.body;
    if(!email || !name || !password){
        return res.status(400).json({message:"Please fill in all the fields"});
    }
    const isExist =await userModel.findOne({email});
    if(isExist){
        return res.status(400).json({message:"User already exists"});
    }
    // Create new user
    else{
        const newUser = new userModel.create({
            email,
            name,
            password
        });
    }
    await newUser.save();
    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.status(201).json({ message: "User registered successfully", token });
}
const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"1d"});
module.exports={userRegister};