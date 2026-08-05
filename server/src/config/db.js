import mongoose from "mongoose";

const connectDb =async ()=>{
    try{
        const result = await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected Successfully")
    }
    catch(error){
        console.log(`Database Error:${error}`)
    }

}

export default connectDb