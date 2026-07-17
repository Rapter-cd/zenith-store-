const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let memoryToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    memoryToken = token;
};

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});

    if (memoryToken) {
        headers.set('Authorization', `Bearer ${memoryToken}`);
    }

    if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const fetchOptions: RequestInit = {
        ...options,
        headers,
        credentials: 'include', // Ensure cookies are sent and received
    };

    let response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

    // Intercept 401 and try to refresh token automatically
    if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
        try {
            const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });
            
            if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                setAuthToken(refreshData.token);
                
                // Retry original request with the new access token
                headers.set('Authorization', `Bearer ${memoryToken}`);
                fetchOptions.headers = headers;
                response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
            } else {
                setAuthToken(null);
            }
        } catch (error) {
            setAuthToken(null);
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Something went wrong');
    }

    if (response.status !== 204) {
        return response.json().catch(() => ({}));
    }
    return null;
};
