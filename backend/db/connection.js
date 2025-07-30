import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(
      process.env.MONGO_URI
    );
    if (connect) console.log("connected to mongodb successfully");
  } catch (err) {
    console.log(err.message)
  }
};

export default dbConnect


