import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/MyProject`)

    // console.log(connectionInstance);

  } catch (error) {
    console.log('MongoDb connection error', error);
    process.exit(1) 
  }
}


export default connectDB