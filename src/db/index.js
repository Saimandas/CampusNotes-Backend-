import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config({
  path: './.env'
});


const ABC = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI);
      
    
    console.log(`Connected to MongoDB at ${connection.connection.host}`);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default ABC;