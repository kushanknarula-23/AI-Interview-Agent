import asyncHandler from "../utils/asyncHandler.js"
import userModel from "../models/user.model.js"
import AppError from "../utils/appError.js"
import { getRefreshToken, getAccessToken, verifyRefreshToken } from "../utils/TokenGenerator.js"
export const googleAuthController = asyncHandler(async (req, res) => {
    const { name, email } = req.body

    // check if the email exists or not 
    let user = await userModel.findOne({
        email
    })

    let isNewUser = false

    if (!user) {
        user = await userModel.create({
            name,
            email,
        })
        isNewUser = true
    }

    const refreshToken = getRefreshToken(user._id)

    

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    const accessToken = getAccessToken(user._id)

    return res.status(200).json({
        message: isNewUser ? "User created Successfully" : "User logged in successfully",
        user,
        accessToken,
    })
})


export const Logout = asyncHandler(async (req, res) => {
    

    // clear cookies

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        success: true,
        message: "Logged out Successfully"
    })

})

export const GetNewAccesToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken
    if (!token) {
        throw new AppError("Refresh token not found", 401)
    }

    let decoded = verifyRefreshToken(token)
    console.log(decoded)
    if (!decoded) {
        throw new AppError("Unable to verify refresh token", 401)
    }

    const newAccessToken = getAccessToken(decoded.id)
    const newRefreshToken = getRefreshToken(decoded.id)


    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        message: "new access token generated",
        accessToken: newAccessToken
    })
})
