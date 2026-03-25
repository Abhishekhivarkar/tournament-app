import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getJoinedMatches = async () => {

  try {

    const response = await api.get("/user/dashboard/joined-matches");

    return response.data;

  } catch (err) {

    return {
      error: true,
      message: err.response?.data?.message
    };

  }

};