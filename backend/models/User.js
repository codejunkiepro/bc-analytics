const pool = require('../config/db');

const User = {
    getById: async (userId) => {
        const [rows] = await pool.query('SELECT * FROM game_bets WHERE user_id = ? LIMIT 1', [userId]);
        return rows[0];
    },

    getStats: async (userId) => {
        const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS total_bets,
        SUM(bet_amount) AS total_wagered,
        SUM(win_amount) AS total_won,
        SUM(win_amount - bet_amount) AS net_profit,
        SUM(CASE WHEN win_amount > bet_amount THEN 1 ELSE 0 END) / COUNT(*) * 100 AS win_rate,
        AVG(bet_amount) AS avg_bet,
        STDDEV(bet_amount) AS bet_stddev,
        MAX(bet_amount) AS max_bet,
        MIN(bet_amount) AS min_bet,
        AVG(odds) AS avg_odds,
        COUNT(DISTINCT game_name) AS games_played,
        COUNT(DISTINCT DATE(FROM_UNIXTIME(bet_time/1000))) AS active_days
      FROM game_bets
      WHERE user_id = ?
    `, [userId]);

        return rows[0];
    },

    getRecentBets: async (userId, limit = 20) => {
        const [rows] = await pool.query(`
      SELECT
        distribute_id,
        game_name,
        bet_amount,
        win_amount,
        odds,
        FROM_UNIXTIME(bet_time/1000) AS bet_time,
        (win_amount - bet_amount) AS profit
      FROM game_bets
      WHERE user_id = ?
      ORDER BY bet_time DESC
      LIMIT ?
    `, [userId, limit]);

        return rows;
    },

    getMonthlyPerformance: async (userId) => {
        const [rows] = await pool.query(`
      SELECT
        DATE_FORMAT(FROM_UNIXTIME(bet_time/1000), '%Y-%m') AS month,
        COUNT(*) AS bets_count,
        SUM(bet_amount) AS total_wagered,
        SUM(win_amount) AS total_won,
        SUM(win_amount - bet_amount) AS net_profit,
        SUM(win_amount - bet_amount) / SUM(bet_amount) * 100 AS roi_percentage
      FROM game_bets
      WHERE user_id = ?
      GROUP BY month
      ORDER BY month DESC
    `, [userId]);

        return rows;
    },

    getPerformanceByGame: async (userId) => {
        const [rows] = await pool.query(`
      SELECT
        game_name,
        COUNT(*) AS bets_count,
        SUM(win_amount - bet_amount) AS net_profit,
        SUM(win_amount - bet_amount) / SUM(bet_amount) * 100 AS roi_percentage
      FROM game_bets
      WHERE user_id = ?
      GROUP BY game_name
      ORDER BY roi_percentage DESC
    `, [userId]);

        return rows;
    }
};

module.exports = User;