import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/analysis';

export const getTopUsers = async (params = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/top-users`, {
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