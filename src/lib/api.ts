const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('zenith_token');
    const headers = new Headers(options.headers || {});

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Something went wrong');
    }

    if (response.status !== 204) {
        return response.json().catch(() => ({}));
    }
    return null;
};
