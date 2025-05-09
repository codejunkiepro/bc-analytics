const User = require('../models/User');
const RiskAssessment = require('../models/RiskAssessment');

module.exports = {
  getProfitableUsers: async (days = 30, minBets = 20, minROI = 10) => {
    const [rows] = await pool.query(`
      SELECT 
        user_id,
        nick_name,
        COUNT(distribute_id) AS total_bets,
        SUM(bet_amount) AS total_wagered,
        SUM(win_amount - bet_amount) AS net_profit,
        SUM(win_amount - bet_amount) / SUM(bet_amount) * 100 AS roi_percentage,
        COUNT(DISTINCT game_name) AS games_played,
        AVG(odds) AS avg_odds,
        MAX(bet_time) AS last_bet_time
      FROM game_bets
      WHERE bet_time >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL ? DAY)) * 1000
      GROUP BY user_id, nick_name
      HAVING net_profit > 0 AND total_bets >= ? AND roi_percentage >= ?
      ORDER BY net_profit DESC, roi_percentage DESC
      LIMIT 50
    `, [days, minBets, minROI]);
    
    return rows;
  },
  
  getFullProfile: async (userId) => {
    const user = await User.getById(userId);
    if (!user) return null;
    
    const stats = await User.getStats(userId);
    const performanceByGame = await User.getPerformanceByGame(userId);
    const recentBets = await User.getRecentBets(userId);
    const monthlyPerformance = await User.getMonthlyPerformance(userId);
    const riskAssessment = await RiskAssessment.calculateScore(userId);
    const riskHistory = await RiskAssessment.getHistory(userId);
    
    return {
      user: {
        user_id: userId,
        nick_name: user.nick_name
      },
      stats,
      performanceByGame,
      recentBets,
      monthlyPerformance,
      riskAssessment,
      riskHistory
    };
  }
};