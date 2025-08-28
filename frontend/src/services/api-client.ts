import axios from "axios";
// const token = localStorage.getItem("Authorization");
//  const t = token ?  `Bearer ${token}` : "";


// export default axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: {
//     "Access-Control-Allow-Origin": "*",
//     "Authorization": t,
    
//   },
// });
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authorization");
    const t = token ? `Bearer ${token}` : "";
    if (t) {
      config.headers.Authorization = t;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

