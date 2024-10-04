import { z } from "zod"
import User from "../modules/user.module.js"
import bcryptjs from 'bcryptjs'
import { usernameValidation } from "../schemas/signUpSchema.js"
import Jwt from 'jsonwebtoken'
const signUp= async(req,res)=>{
   
   try {
     const {username,password,email}= req.body
 
     const user=await User.findOne({email})
     if (user) {
         return res.status(400).json({succes:false,message:"user already exists please login"})
     }
     
     const salt= await bcryptjs.genSalt(10)
     const hashedPassword= await bcryptjs.hash(password,salt)
    const newUser= await new User({
         username,
         email,
        password: hashedPassword
     })
     const savedUser= await newUser.save()
     if (savedUser) {
         return res.status(200).json({succes:true,message: "user succesfully registered"})
     }else{
         return res.status(500).json({succes:true,message: "failed to registered user"})
     }
   } catch (error) {
    console.log(error);
    return res.status(500).json({succes:false,message: "something went wrong"})
   }
   
}

const usernameCheck= async (req,res)=>{
    const usernameQuery= z.object({
        username:usernameValidation
    })
    const usernames= req.params.username
    const params={
        username:usernames
    }
    const result= usernameQuery.safeParse(params)
    console.log(result);
    if (!result.success) {
        const errMsg= result.error.format().username?._errors || []
        console.log(errMsg);
        return res.status(401).json({succes:false,message:errMsg.length>0?errMsg.join(" ,"):"invalid query params"})
    }

    const {username}= result.data
    const existingUser= await User.findOne({username})
    if (existingUser) {
        return res.status(402).json({succes:false,message:"username is already taken"})
    }
    return res.status(200).json({succes:true,message:"username is unique"})

}

const logIn= async(req,res)=>{
     try {
        const {email,password}= req.body
        const user= await User.findOne({email}).select("--password")
        if (!user) {
           return res.status(404).json({succes:false,message:"user doest not exist"})
        }
        const isPasswordCorrect= await bcryptjs.compare(password,user.password)
        if (!isPasswordCorrect) {
           return res.status(402).json({succes:false,message:"password is invalid"})
        }
        const tokenData= {_id:user._id.toString()}
        const accesToken= await Jwt.sign(tokenData,process.env.ACCES_TOKEN_SECRET,{expiresIn:"2d"})
        const refreshToken= await Jwt.sign(tokenData,process.env.REFRESH_TOKEN_SECRET)
        user.refreshToken=refreshToken
        const option={
           httpOnly:true,
           secure:true
        }
       return res.status(200)
       .cookie("accesToken",accesToken,option)
       .cookie("refreshToken",refreshToken,option)
       .json({message:"user succesfyly logged in" })
     } catch (error) {
        return res.status(500).json({error, message:"Something went wrong"})
     }
}

const logOut= async (req,res)=>{
   
    try {
        const option={
            httpOnly:true,
            secure:true
        }
        return res.status(200).clearCookie("accesToken",option).json({message:"user succesfuly logout"})
    } catch (error) {
        return res.status(500).json({message:"something went wrong",error})
    }
}

const getCurrentUser= async(req,res)=>{
        try {
            const token= req.cookies.accesToken.toString();
            if (!token) {
                return res.json({succes:false,message:"invlid token"})
            }
            const decodedToken= await Jwt.verify(token,process.env.ACCES_TOKEN_SECRET)
           
            console.log(token);
            const user = await User.findOne({_id:decodedToken._id})
            if (!user) {
                return res.json({succes:false,message:"invlid token"})
            }
            return res.json({message:"user get succcesfully",user})
        } catch (error) {
            return res.json({message:"somthing went wrong while getting the user",error})
        }
}
const loginWithGoogle= async(req,res)=>{
    try {
        
        const userId= req.user
     const user=   await new User({
            username:userId.name.trim(" "),
            email:userId.email,
            avatar:userId.avatar
        })
        const savedUser= await user.save()
        console.log(savedUser);
       return res.status(200).json({userId})
    } catch (error) {
        return res.status(501).json({succes:false,message:"something went wrong",error})
    }
}
const getTotalUsers= async(req,res)=>{
    try {
        const data= await User.countDocuments();
        if (!data) {
          return res.status(400).json({ message: "Something went wrong while counting the Users"}); 
        }

        return res.status(200).json({count:data,succes:true})
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong", error: error }); 
    }
  }
export{
    signUp, usernameCheck,logIn,logOut,loginWithGoogle,getCurrentUser,getTotalUsers
}