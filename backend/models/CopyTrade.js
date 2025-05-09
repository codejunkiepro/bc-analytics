const pool = require('../config/db');

const CopyTrade = {
    create: async (followerId, traderId, initialAmount) => {
        const [result] = await pool.query(`
      INSERT INTO copied_traders 
      (follower_id, trader_id, initial_amount, current_amount)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE is_active = TRUE
    `, [followerId, traderId, initialAmount, initialAmount]);

        return result.insertId;
    },

    deactivate: async (followerId, traderId) => {
        await pool.query(`
      UPDATE copied_traders 
      SET is_active = FALSE 
      WHERE follower_id = ? AND trader_id = ?
    `, [followerId, traderId]);
    },

    recordDailyPerformance: async (copyId, traderId) => {
        const [dailyPerformance] = await pool.query(`
      SELECT 
        SUM(win_amount - bet_amount) AS daily_profit,
        SUM(win_amount - bet_amount) / SUM(bet_amount) * 100 AS daily_roi
      FROM game_bets
      WHERE 
        user_id = ?
        AND bet_time >= UNIX_TIMESTAMP(CURDATE()) * 1000
        AND bet_time < UNIX_TIMESTAMP(CURDATE() + INTERVAL 1 DAY) * 1000
    `, [traderId]);

        if (dailyPerformance[0].daily_profit !== null) {
            await pool.query(`
        INSERT INTO copy_performance
        (copy_relation_id, date, daily_profit, daily_roi)
        VALUES (?, CURDATE(), ?, ?)
      `, [copyId, dailyPerformance[0].daily_profit, dailyPerformance[0].daily_roi]);

            await pool.query(`
        UPDATE copied_traders
        SET current_amount = current_amount + ?
        WHERE id = ?
      `, [dailyPerformance[0].daily_profit, copyId]);
        }
    },

    getForFollower: async (followerId) => {
        const [copies] = await pool.query(`
      SELECT 
        ct.*,
        u.nick_name AS trader_name,
        (ct.current_amount - ct.initial_amount) AS total_profit,
        (ct.current_amount - ct.initial_amount) / ct.initial_amount * 100 AS total_roi
      FROM copied_traders ct
      JOIN (
        SELECT user_id, nick_name FROM game_bets GROUP BY user_id, nick_name
      ) u ON ct.trader_id = u.user_id
      WHERE ct.follower_id = ?
    `, [followerId]);

        return copies;
    },

    getPerformanceHistory: async (copyId) => {
        const [rows] = await pool.query(`
      SELECT date, daily_profit, daily_roi
      FROM copy_performance
      WHERE copy_relation_id = ?
      ORDER BY date DESC
    `, [copyId]);

        return rows;
    }
};

module.exports = CopyTrade;