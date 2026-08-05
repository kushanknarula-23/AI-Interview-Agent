import jwt from "jsonwebtoken"
const getRefreshToken = (userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"})
}

const getAccessToken = (userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"15m"})
}

const verifAccessToken = (token)=>{
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return null  // return null instead of throwing
    }
}

const verifyRefreshToken = (token)=>{
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return null  // return null instead of throwing
    }
}
export {getRefreshToken,getAccessToken,verifAccessToken,verifyRefreshToken}