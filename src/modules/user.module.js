import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        index:true,
        unique:true
     },
     email:{
         type:String,
         required:true,
         lowercase:true,
         trim:true,
         unique:true
      },
     
      avatar:{
         type:String,
       
      },
      notes:[{
         type: mongoose.Schema.Types.ObjectId,
         ref:"Notes"
      }],
       password:{
          type:String,
          required:[true, "password is required"] 
       },
       refreshToken:{
         type:String
       },
       isAdmin:{
         type: Boolean,
         default:false
       }
 
},{timestamps:true})

const User= mongoose.model("User",userSchema)
export default User