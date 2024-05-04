import mongoose from "mongoose";

const depertmentSchema= new mongoose.Schema({
    depertmentName:{
        type:String
    },
    notes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
    
},{timestamps:true})

export const Depertment=mongoose.model("Depertment",depertmentSchema)