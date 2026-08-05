import userModel from "../models/user.model.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifAccessToken } from "../utils/TokenGenerator.js";


const authMiddleware = asyncHandler(async(req,res,next)=>{
    const token = req.headers.authorization?.replace("Bearer ","")

    if(!token){
        throw new AppError("Unauthorized request",401)
    }

    // but if the token exist then verify it with the jwt
    let decodedToken = verifAccessToken(token)
   
    if(!decodedToken){
        throw new AppError("Unable to verify the token",401)
    }

    const User = await userModel.findById(
        decodedToken.id
    )

    // if we dont find the user then 

    if(!User){
        throw new AppError("Invalid Access token",401)
    }

    // if token is found then

    req.user = User
    next()

})

export default authMiddleware
