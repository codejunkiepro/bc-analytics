const userService = require('../services/userService');

module.exports = {
  getTopUsers: async (req, res) => {
    try {
      const { days = 30, minBets = 20, minROI = 10 } = req.query;
      const users = await userService.getProfitableUsers(days, minBets, minROI);
      res.json(users);
    } catch (error) {
      console.error('Error fetching top users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  getUserProfile: async (req, res) => {
    try {
      const userId = req.params.userId;
      const profile = await userService.getFullProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};