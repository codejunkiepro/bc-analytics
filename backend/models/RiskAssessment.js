const pool = require('../config/db');

const RiskAssessment = {
    calculateScore: async (userId) => {
        const [stats] = await pool.query(`
      SELECT
        STDDEV(bet_amount) / AVG(bet_amount) AS bet_variability,
        STDDEV(win_amount - bet_amount) AS profit_volatility,
        MAX(bet_amount) / AVG(bet_amount) AS max_bet_ratio,
        COUNT(DISTINCT game_name) AS game_diversity,
        COUNT(*) / COUNT(DISTINCT DATE(FROM_UNIXTIME(bet_time/1000))) AS bets_per_day
      FROM game_bets
      WHERE user_id = ?
    `, [userId]);

        if (!stats[0]) return null;

        const factors = stats[0];

        // Normalize and weight factors
        const normalizedVariability = Math.min(factors.bet_variability / 2, 1);
        const normalizedVolatility = Math.min(factors.profit_volatility / (factors.profit_volatility + 100), 1);
        const normalizedMaxBet = Math.min(factors.max_bet_ratio / 10, 1);
        const normalizedDiversity = 1 - Math.min(factors.game_diversity / 15, 1);
        const normalizedFrequency = Math.min(factors.bets_per_day / 50, 1);

        const riskScore = (
            (normalizedVariability * 0.3) +
            (normalizedVolatility * 0.25) +
            (normalizedMaxBet * 0.2) +
            (normalizedDiversity * 0.15) +
            (normalizedFrequency * 0.1)
        ) * 100;

        return {
            riskScore: Math.min(Math.round(riskScore), 100),
            factors: {
                betVariability: normalizedVariability * 100,
                profitVolatility: normalizedVolatility * 100,
                maxBetRatio: normalizedMaxBet * 100,
                gameDiversity: normalizedDiversity * 100,
                betFrequency: normalizedFrequency * 100
            }
        };
    },

    getHistory: async (userId) => {
        const [rows] = await pool.query(`
      SELECT
        DATE(FROM_UNIXTIME(bet_time/1000)) AS date,
        SUM(bet_amount) AS daily_wagered,
        SUM(win_amount - bet_amount) AS daily_profit,
        STDDEV(bet_amount) AS daily_bet_stddev
      FROM game_bets
      WHERE user_id = ?
      GROUP BY date
      ORDER BY date DESC
      LIMIT 30
    `, [userId]);

        return rows;
    }
};

module.exports = RiskAssessment;