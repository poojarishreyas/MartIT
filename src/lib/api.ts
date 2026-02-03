import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. https://api.mart-it.com
  withCredentials: true,                 // ⭐ REQUIRED for Go cookies
  timeout: 10000,
});
