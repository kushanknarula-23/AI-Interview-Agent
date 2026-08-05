import axios from "axios"

export const ServerUrl = "http://localhost:3000"

const axiosInstance = axios.create({
    baseURL: ServerUrl,
    withCredentials: true,
})

export default axiosInstance