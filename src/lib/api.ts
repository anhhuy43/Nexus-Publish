import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
