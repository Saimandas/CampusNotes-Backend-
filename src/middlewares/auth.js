
import User from '../modules/user.module.js'
import Jwt from 'jsonwebtoken'
export async function isLoggedIn(req,res,next){
    try {
        const token= req.cookies?.accesToken
        if (!token) {
            return res.status(402).json({succes:false,message:"you need to login to procced"})
        }
   
        const isTokenCorrect= await Jwt.verify(token,process.env.ACCES_TOKEN_SECRET)
        ;
        if (!isTokenCorrect) {
            return res.status(400).json({message:"token is incorrect"})
        }
        const user= await User.findOne({
            Token:isTokenCorrect
        })
        
        if (!user) {
            return res.status(400).json({message:"cant find the user"})
        }
        req.user=user
        next()
    } catch (error) {
        return res.status(500).json({message:"something went wrong",error})
    }
  
    }