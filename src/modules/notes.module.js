import mongoose from "mongoose";

const notesSchema= new mongoose.Schema({
    notesName:{
        type:String,
        required:[true,"name of the notes should be defined"],
        unique:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject"
    },
    depertment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Depertment"
    },
    user_id:{
        type:String,
        required:false
    },
    isVerified:{
        type:Boolean,
    }
    
    
},{timestamps:true})

export const Notes= mongoose.model("Notes",notesSchema)