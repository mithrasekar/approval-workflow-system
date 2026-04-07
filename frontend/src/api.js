import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// A helper to get the currently logged in user ID from localStorage
export const getActiveUserId = () => localStorage.getItem('MOCK_USER_ID') || "101";

export const setMockUser = (id) => {
    localStorage.setItem('MOCK_USER_ID', id);
};

export default api;
