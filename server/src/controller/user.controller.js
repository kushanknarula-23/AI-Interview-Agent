import asyncHandler from "../utils/asyncHandler.js"
export const getCurrentUser = asyncHandler(async(req,res)=>{
    const CurrentUser = req.user
    res.status(200).json({
        user:CurrentUser
    })
})

