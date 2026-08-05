import {Router} from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { getCurrentUser} from "../controller/user.controller.js"
const userRouter = Router()


userRouter.get("/current-user",authMiddleware,getCurrentUser)


export default userRouter