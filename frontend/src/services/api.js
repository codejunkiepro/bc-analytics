import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getTopUsers = async (params = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/analysis/top-users`, {
            params: {
                days: params.days || 30,
                minBets: params.minBets || 20,
                minROI: params.minROI || 10
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching top users:', error);
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const startCopying = async (followerId, traderId, initialAmount) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/copy/start`, {
            followerId,
            traderId,
            initialAmount
        });
        return response.data;
    } catch (error) {
        console.error('Error starting copy:', error);
        throw error;
    }
};

export const stopCopying = async (followerId, traderId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/copy/stop`, {
            followerId,
            traderId
        });
        return response.data;
    } catch (error) {
        console.error('Error stopping copy:', error);
        throw error;
    }
};

export const getCopyPerformance = async (followerId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/copy/performance/${followerId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching copy performance:', error);
        throw error;
    }
};