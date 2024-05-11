import {z} from "zod"

const usernameValidation=
z.string().min(2,"username must have at least two charecter").max(12,"No more than 12 charecter")
.regex(/(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/gm,"username can't conatain special charecter or space")

const signUpSchema= z.object({
    username:usernameValidation,
    email:z.string().email({message:"invalid email addres"}),
    password:z.string().min(6,{message:"password must be alteast 6 charecter"})
})

export{
    signUpSchema,
    usernameValidation
}