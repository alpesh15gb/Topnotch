import axios from 'axios';
import { useAuthStore } from '../store/auth-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://topnotch.apextime.in/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
