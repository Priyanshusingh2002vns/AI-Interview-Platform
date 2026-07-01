import axios from "axios";

const BASE_URL = "https://ai-interview-platform-y8jv.onrender.com/api/";

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");

    console.log("TOKEN:",token)

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const refresh = localStorage.getItem("refresh");

                const res = await axios.post(
                    `${BASE_URL}token/refresh/`,
                    {
                        refresh,
                    }
                );

                localStorage.setItem("access", res.data.access);

                originalRequest.headers.Authorization =
                    `Bearer ${res.data.access}`;

                return api(originalRequest);

            } catch {

                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;