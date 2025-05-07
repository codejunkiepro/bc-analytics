const userService = require('../services/userService');

const userAnalysisController = {
  getTopUsers: async (req, res) => {
    try {
      const { days = 30, minBets = 20, minROI = 10 } = req.query;
      
      const users = await userService.getProfitableUsers(
        parseInt(days),
        parseInt(minBets),
        parseFloat(minROI)
      );
      
      // Enhance with additional metrics
      const enhancedUsers = await Promise.all(users.map(async user => {
        const consistency = await userService.getUserConsistency(user.user_id);
        const gamePerformance = await userService.getUserPerformanceByGame(user.user_id);
        
        return {
          ...user,
          ...consistency,
          gamePerformance,
          riskFactor: (consistency.bet_stddev / consistency.avg_bet) * 100
        };
      }));
      
      res.json(enhancedUsers);
    } catch (error) {
      console.error('Error fetching top users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = userAnalysisController;