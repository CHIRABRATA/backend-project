const mongosse=require('mongoose');

const transcationSchema=new mongosse.Schema({
    fromaccountId:{
        type:mongosse.Schema.Types.ObjectId,
        ref:'Account',
        index:true // using b+tree index for faster lookups
    },
    toaccountId:{
        type:mongosse.Schema.Types.ObjectId,
        ref:'Account',
        index:true // using b+tree index for faster lookups
    },
    amount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","completed","failed","reversed"],
        default:"pending"
    },
    idempotencyKey:{// same transaction should not be processed multiple times
        type:String,
        required:true,
        unique:true // Ensure idempotency key is unique to prevent duplicate transactions
    }
});

export const transcationModel=mongosse.model('Transcation',transcationSchema);