import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";
import { analyzeresume, FinishInterview, generateQuestion, getInterview, getInterviewReport, Submitanswer } from "../controller/interview.controller.js";
const interviewRouter = Router()
interviewRouter.post("/resume",authMiddleware,upload.single("resume"),analyzeresume)
interviewRouter.post("/generate-question",authMiddleware,generateQuestion)
interviewRouter.post("/submit-answer",authMiddleware,Submitanswer)
interviewRouter.post("/finish-interview",authMiddleware,FinishInterview)
interviewRouter.get("/get-interview",authMiddleware,getInterview)
interviewRouter.get("/report/:id",authMiddleware,getInterviewReport)
export default interviewRouter