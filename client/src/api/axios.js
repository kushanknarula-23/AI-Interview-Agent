import axios from "axios"

export const ServerUrl = "https://ai-interview-agent-7-7dp9.onrender.com"

const axiosInstance = axios.create({
    baseURL: ServerUrl,
    withCredentials: true,
})

export default axiosInstance
