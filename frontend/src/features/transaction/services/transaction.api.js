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



export const requestWithdraw = async (amount) => {

  try {

    const res = await api.post("/transaction/withdraw", {
      amount
    });

    return res.data;

  } catch (err) {

    return {
      err: true,
      message: err.response?.data?.message
    };

  }

};



export const getMyTransactions = async (page = 1, limit = 10) => {

  try {

    const res = await api.get(
      `/transaction/my?page=${page}&limit=${limit}`
    );

    return res.data;

  } catch (err) {

    return {
      err: true,
      message: err.response?.data?.message
    };

  }

};