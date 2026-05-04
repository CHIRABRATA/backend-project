const mongoose= require('mongoose');

const ledgerSchema=new mongoose.Schema({
    accountId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Account',
        index:true, // using b+tree index for faster lookups
        immutable:true // once a ledger entry is created, the accountId should not change

    },
    transcationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Transcation',
        index:true, // using b+tree index for faster lookups
        immutable:true // once a ledger entry is created, the transcationId should not change
    },  
    amount:{
        type:Number,
        required:true,
        immutable:true // once a ledger entry is created, the amount should not change

    },
    type:{
        type:String,
        enum:["debit","credit"],
        required:true
    },
    balanceAfterTranscation:{ // to keep track of the balance after each transaction
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    }
});
// Prevent any modifications to ledger entries after they are created
function PreventLedgerModification(next){
    if(!this.isNew){
        return next(new Error("Ledger entries cannot be modified after creation"));
    }
}
ledgerSchema.pre('findOneAndUpdate', PreventLedgerModification);
ledgerSchema.pre('updateOne', PreventLedgerModification);
ledgerSchema.pre('updateMany', PreventLedgerModification);
ledgerSchema.pre('update', PreventLedgerModification);
ledgerSchema.pre('deleteOne', PreventLedgerModification);
ledgerSchema.pre('deleteMany', PreventLedgerModification);
ledgerSchema.pre('findOneAndDelete', PreventLedgerModification);
ledgerSchema.pre('findOneAndReplace', PreventLedgerModification);

const ledgerModel=mongoose.model('Ledger',ledgerSchema);    
module.exports=ledgerModel;
