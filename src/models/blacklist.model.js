const mongoose=require("mongoose");

const blacklistSchema=new mongoose.Schema({ 
    token:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
});
//token only valid for 3 days 
//i need only 3 days to expire the token and remove it from the blacklist collection
blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 259200 }); // Automatically remove expired tokens (3 days)


const blacklistModel=mongoose.model("Blacklist",blacklistSchema);

module.exports=blacklistModel;