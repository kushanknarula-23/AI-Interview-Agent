import mongoose from "mongoose"
const questionSchema = new mongoose.Schema({
    question:String,
    difficulty:String,
    timelimit:Number,
    answer:String,
    feedback:String,
    score:{type:Number , default:0},
    confidence:{type:Number , default:0},
    communication:{type:Number , default:0},
    correctness:{type:Number , default:0},
    
})
const interviewSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    role:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true,
    },
    mode:{
        type:String,
        enum:["Technical","HR"],
        required:true
    },
    resumetext:{
        type:String,
        default:""
    },
    question:[questionSchema],
    finalScore:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:["incompleted","completed"],
        default:"incompleted"
    }
},{timestamps:true})

const interviewModel = mongoose.model("interview",interviewSchema)

export default interviewModel