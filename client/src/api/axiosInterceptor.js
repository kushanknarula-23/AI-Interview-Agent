import axiosInstance from "./axios";
import store from "../redux/store.js"
import { setAccesstoken , logout } from "../redux/authSlice";

export const setupInterceptors = () => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = store.getState().auth.accessToken
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )

    // ✅ error handler must be passed as second argument to .use()
    axiosInstance.interceptors.response.use(
        response => response,
        async (error) => {
            const originalRequest = error.config
            
            // Skip retrying if status is not 401 or if the failed request was already a refresh/logout request
            const isAuthEndpoint = originalRequest?.url?.includes("/api/auth/getAccessToken") || originalRequest?.url?.includes("/api/auth/logout")
            
            if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
                originalRequest._retry = true
                try {
                    const { data } = await axiosInstance.post("/api/auth/getAccessToken")
                    store.dispatch(setAccesstoken(data.accessToken))
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
                    return axiosInstance(originalRequest)
                } catch (err) {
                    store.dispatch(logout())
                    return Promise.reject(err)
                }
            }
            return Promise.reject(error)
        }
    )
}
  


// response interceptor

