import { Notes } from "../modules/notes.module.js";
import uploadFile from "../utils/cloudnary.js";
import { Subject } from '../modules/subject.module.js';
import { Depertment } from '../modules/depertment.module.js';
import User from "../modules/user.module.js";
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
        });
        subjectSchema.notes.push(post._id);

        const depertmentSchema = await new Depertment({
            depertmentName: depertment 
        });
        depertmentSchema.notes.push(post._id);
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

  const verifyNotes= async(req,res)=>{
    
    const allNotes=await Notes.find()
    return res.status(200).json({allNotes})

  }
    
 
export {
    uploadPost,deletePost,verifyNotes
}
