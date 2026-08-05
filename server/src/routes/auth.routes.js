import {Router} from "express"
import {GetNewAccesToken, googleAuthController, Logout} from "../controller/auth.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"

const authRouter = Router()

authRouter.post("/googleAuth",googleAuthController)
authRouter.get("/logout",authMiddleware,Logout)
authRouter.post("/getAccessToken",GetNewAccesToken)
export default authRouter