import { Notes } from "../modules/notes.module.js";
import uploadFile from "../utils/cloudnary.js";
import { Subject } from '../modules/subject.module.js';
import { Depertment } from '../modules/depertment.module.js';
import User from "../modules/user.module.js";
import Jwt from 'jsonwebtoken'
const uploadPost = async (req, res) => {
    try {
        const { name, subject, depertment } = req.body; 

        const localFilePath = await req.files?.notesImg[0].path;
        if (!localFilePath) {
            return res.status(500).json({ message: "can't get image" }); 
        }

        const notesImg = await uploadFile(localFilePath);
       if (!notesImg) {
        return res.status(500).json({ message: "can't upload image" }); 
       }
        const post = await new Notes({
            notesName: name,
            imageUrl: notesImg,
            user_id:req.user._id
        });
        
        if (!post) {
          return res.status(500).json({ message: "can't create post" }); 
        }
        const user= await User.findById(req.user._id)
       
        if (!user) {
            return res.status(400).json({message:"cant find the user"})
        }

       const abc=  user.notes.push(post._id)
       console.log(abc);
       await user.save()

        const subjectSchema = await new Subject({
            name: subject,
            notes:post._id
        });
       

        const depertmentSchema = await new Depertment({
            depertmentName: depertment,
            notes:post._id
        });
     
        post.subject = subjectSchema._id;
        post.depertment = depertmentSchema._id;

        await depertmentSchema.save(); 
        await subjectSchema.save(); 

        const savedPost = await post.save();

        return res.status(200).json({ message: "notes Uploaded Successfully", post: savedPost, }); 
    } catch (error) {
        return res.status(500).json({ message: "something went wrong", error: error }); 
    }
}

 const deletePost= async(req,res)=>{

        try {
            const { post_id } = req.body;
            if (!post_id) {
                return res.status(400).json({ message: "Please provide the post ID" }); 
            }
        
            const post = await Notes.findOneAndDelete({_id:post_id})
            if (!post) {
                return res.status(400).json({ message: "Can't find the note" });
            }
    
            await Depertment.updateMany({ notes: post_id }, { $pull: { notes: post_id } });
            await User.updateMany({ notes: post_id }, { $pull: { notes: post_id } });
            await Subject.updateMany({ notes: post_id }, { $pull: { notes: post_id } });
    
            return res.status(200).json({ message: "Note deleted successfully", notes: post });
        } catch (error) {
            return res.status(500).json({ message: "Something went wrong", error: error }); 
        }
    }

  const listNotesForVerification= async(req,res)=>{
    const cookie= await req.cookies.accesToken;
    const decodedToken= await Jwt.verify(cookie,process.env.ACCES_TOKEN_SECRET)
    const {_id}= decodedToken

    const user= await User.findOne({_id,isAdmin:true})

    if (!user) {
      return res.status(400).json({message:"only admins can verify notes"}) 
    }
    const allNotes= await Notes.find()
    console.log(allNotes);
    return res.status(200).json({allNotes})  
    
  }

  const verifyNotes= async (req,res)=>{

    const {notes_id,verifyFlag}=req.body
    const notes= await Notes.findById(notes_id)
    if (verifyFlag) {
        notes.isVerified=true
       await notes.save()
       return res.status(200).json({message:"succesfylly verified the notes"})
    }else{
      await  Notes.findByIdAndDelete(notes_id)
      return res.status(200).json({message:"succesfully rejected notes"})
    }
  }

  const getNotesBySubject= async (req,res)=>{
    try {
        const subject  = req.params.subject
        if (!subject) {
            return res.status(400).json({message:"Invalid params"})
        }
       
        const notes= await Notes.aggregate([{
            $lookup: {
              from: "subjects",
              localField:"subject",
              foreignField:"_id",
              as: "SubjectNotes"
            }
          },{
            $addFields: {
              SubNotes:{
                $arrayElemAt:["$SubjectNotes",0]
              }
            }
          },
           {
             $match: {
               "SubNotes.name": subject
             }
           }
          ])
        if (!notes) {
          return res.status(500).json({ message:"no notes is belongs to this subject" }); 
        }
          return res.status(200).json({notes})
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error }); 
    }
  }

  const getNotesByDepertment= async(req,res)=>{
    try {
      const depertment= req.params.depertment
      if (!depertment) {
        return res.status(400).json({message:"Invalid params"})
      }
      const notes= await Notes.aggregate([{
        $lookup: {
          from: "depertments",
          localField:"depertment",
          foreignField:"_id",
          as: "DepertmentNotes"
        }
      },{
        $addFields: {
          DeptNotes:{
            $arrayElemAt:["$DepertmentNotes",0]
          }
        }
      },
 {
         $match: {
           "DeptNotes.depertmentName":"BCA"
         }
       }
       ])
      if (!notes) {
        return res.status(500).json({ message:"no notes is belongs to this depertment" }); 
      }
      return res.status(200).json({notes})
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong", error: error }); 
    }
  }

  const displayNotes= async(req,res)=>{
    try {
      const notes= await Notes.find({isVerified:true})
      if (notes[0]==null) {
        return res.status(500).json({message:"notes are not verified"})
      }

      return res.status(200).json({notes})
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong", error: error }); 
    }
  }
export {
    uploadPost,deletePost,verifyNotes,getNotesBySubject,getNotesByDepertment,listNotesForVerification,displayNotes
}