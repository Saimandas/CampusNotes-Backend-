import { Router } from "express";
import { logIn, logOut, signUp, usernameCheck,loginWithGoogle, getCurrentUser} from "../controllers/user.controler.js";
import { deletePost, getNotesBySubject, uploadPost, verifyNotes,getNotesByDepertment ,listNotesForVerification,displayNotes} from "../controllers/post.controller.js";
import {passport} from '../app.js'
import { upload } from "../middlewares/multer.js";
import {isLoggedIn} from '../middlewares/auth.js'
const router=Router();

router.route("/register").post(signUp)
router.route("/checkUsername/:username").get(usernameCheck)
router.route("/getCurrentUser").get(getCurrentUser)
router.route("/login").post(logIn)
router.route("/logout").post(logOut)
router.route("/loginWithGoogle").get(passport.authenticate("google",{scope:["profile","email"]}))
router.route("/authGoogle").get(passport.authenticate("google",{failureRedirect:"/login"}),(req,res)=>{
    if (req.isAuthenticated) {
        res.render("https://campus-notes-tihucollege.onrender.com/")
    }
    res.render("https://campus-notes-tihucollege.onrender.com/upload/login")
})
router.route("/upload-notes").post(isLoggedIn,
upload.fields([{
    name:"notesImg",
    maxCount:50
}]), uploadPost
)
router.route("/listNotesForAdmin").get(listNotesForVerification)
router.route("/delete-notes").post(deletePost)
router.route("/verify-notes").post(verifyNotes)
router.route("/Sub-notes/:subject").get(getNotesBySubject)
router.route("/Dept-notes/:depertment").get(getNotesByDepertment)
router.route("/notes").get(displayNotes)
export default router