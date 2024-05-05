import { Router } from "express";
import { logIn, logOut, signUp, usernameCheck,loginWithGoogle} from "../controllers/user.controler.js";
import { deletePost, getNotesBySubject, uploadPost, verifyNotes,getNotesByDepertment } from "../controllers/post.controller.js";
import {passport} from '../app.js'
import { upload } from "../middlewares/multer.js";
import {isLoggedIn} from '../middlewares/auth.js'
const router=Router();

router.route("/register").post(signUp)
router.route("/checkUsername/:username").get(usernameCheck)
router.route("/login").post(logIn)
router.route("/logout").post(logOut)
router.route("/loginWithGoogle").get(passport.authenticate("google",{scope:["profile","email"]}))
router.route("/authGoogle").post(passport.authenticate("google",{failureRedirect:"/login"}),loginWithGoogle)
router.route("/upload-notes").post(isLoggedIn,
upload.fields([{
    name:"notesImg",
    maxCount:8
}]), uploadPost
)
router.route("/delete-notes").post(deletePost)
router.route("/verify-notes").post(verifyNotes)
router.route("/Sub-notes/:subject").get(getNotesBySubject)
router.route("/Dept-notes/:depertment").get(getNotesByDepertment)
export default router