import mongoose from "mongoose";

const subjectSchema= new mongoose.Schema({
    name:{
        type:String,
    },
    notes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Notes"
    }]

    
},{timestamps:true})

export const Subject= mongoose.model("Subject",subjectSchema)