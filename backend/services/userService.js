const pool = require('../config/db');

const userService = {
  // Get profitable users for copy trading
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
      FROM 
        game_bets
      WHERE 
        bet_time >= UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL ? DAY)) * 1000
      GROUP BY 
        user_id, nick_name
      HAVING 
        net_profit > 0
        AND total_bets >= ?
        AND roi_percentage >= ?
      ORDER BY 
        net_profit DESC, roi_percentage DESC
      LIMIT 50
    `, [days, minBets, minROI]);
    
    return rows;
  },

  // Get user consistency metrics
  getUserConsistency: async (userId) => {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(CASE WHEN win_amount > bet_amount THEN 1 END) / COUNT(*) * 100 AS win_rate,
        AVG(bet_amount) AS avg_bet,
        STDDEV(bet_amount) AS bet_stddev,
        MAX(bet_amount) AS max_bet,
        MIN(bet_amount) AS min_bet
      FROM 
        game_bets
      WHERE 
        user_id = ?
    `, [userId]);
    
    return rows[0];
  },

  // Get performance by game type
  getUserPerformanceByGame: async (userId) => {
    const [rows] = await pool.query(`
      SELECT 
        game_name,
        COUNT(*) AS bets_count,
        SUM(win_amount - bet_amount) AS net_profit,
        SUM(win_amount - bet_amount) / SUM(bet_amount) * 100 AS roi_percentage
      FROM 
        game_bets
      WHERE 
        user_id = ?
      GROUP BY 
        game_name
      ORDER BY 
        roi_percentage DESC
    `, [userId]);
    
    return rows;
  }
};

module.exports = userService;