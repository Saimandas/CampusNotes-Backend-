import express, { urlencoded } from 'express'
import corse from 'cors'
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from  'express-session'
import {Strategy as Googlestrategy} from 'passport-google-oauth20'
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
    cookie:{secure:false}
  }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Googlestrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/v1/users/authGoogle'
},

    function(accesToken,refereshToken,profile,cb){
      cb(null,profile)
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
app.use("/api/v1/users",router);


export default app;
