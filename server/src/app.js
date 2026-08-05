import express from "express"
import globalErrorHanlder from "./middleware/globalErrorhanlder.middleware.js"
import cookieparser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import cors from "cors"
import InterviewRouter from "./routes/resume.routes.js"
const app = express()

// dummy api
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}))

app.use(express.json())
app.use(cookieparser())



app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/interview",InterviewRouter)


app.use(globalErrorHanlder)
export default app