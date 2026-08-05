import axios from "axios"

export const ServerUrl = "https://ai-interview-agent-2-py9j.onrender.com"

const axiosInstance = axios.create({
    baseURL: ServerUrl,
    withCredentials: true,
})

export default axiosInstance
