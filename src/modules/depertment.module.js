import mongoose from "mongoose";

const depertmentSchema= new mongoose.Schema({
    depertmentName:{
        type:String,
        unique:false
    },
    notes:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    
},{timestamps:true})

export const Depertment=mongoose.model("Depertment",depertmentSchema)