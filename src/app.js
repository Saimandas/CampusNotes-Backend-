import express, { urlencoded } from 'express'
import corse from 'cors'
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from  'express-session'
import {Strategy as Googlestrategy} from 'passport-google-oauth20'
import Jwt from 'jsonwebtoken';
const app= express();

app.use(corse({
    origin:process.env.CORS_ORIGIN
}))
app.use(express.json({limit:"16kb"}))
app.use(urlencoded({ extended:true,  limit:'16kb'}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(session({
    secret: process.env.PASSWORD_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{secure:true}
  }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Googlestrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://campus-notes-tihucollege.onrender.com/"
},
   async function(accesToken,refereshToken,profile,cb){
      try {
         let user = await User.findOne({ email: profile.emails[0].value});
         console.log(user);
         if (!user) {
            const newUser= new User({
                 email:profile.emails[0].value,
                 username:profile.displayName,
                 
             })
             const savedUser= newUser.save({validateBeforeSave:false})
             const tokenData= {
              _id:user._id
             }
             const accesToken= await Jwt.sign(tokenData,process.env.ACCES_TOKEN_SECRET,{expiresIn:"2d"})
             const option= {
              httpOnly:true,
              secure:true
             }
             savedUser.cookie("accesToken",accesToken,option)
            return cb(null,savedUser)
         }
         cb(null,user)
         return cb(new Error("Username already exists"))
     } catch (error) {
         cb(error)
     }
    }
)) 

passport.serializeUser(function(user,cb){
    cb(null,user)
})
passport.deserializeUser(function(user,cb){
    cb(null,user)
})
export  {passport}
  
import router from './routes/user.routes.js';
import User from './modules/user.module.js';
app.use("/api/v1/users",router);


export default app;
