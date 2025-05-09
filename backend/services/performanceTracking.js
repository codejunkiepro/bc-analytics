const CopyTrade = require('../models/CopyTrade');

module.exports = {
    startCopying: async (followerId, traderId, initialAmount) => {
        return await CopyTrade.create(followerId, traderId, initialAmount);
    },

    stopCopying: async (followerId, traderId) => {
        return await CopyTrade.deactivate(followerId, traderId);
    },

    updateDailyPerformance: async () => {
        const [activeCopies] = await pool.query(`
      SELECT id, trader_id FROM copied_traders WHERE is_active = TRUE
    `);

        for (const copy of activeCopies) {
            await CopyTrade.recordDailyPerformance(copy.id, copy.trader_id);
        }
    },

    getCopyPerformance: async (followerId) => {
        const copies = await CopyTrade.getForFollower(followerId);

        return await Promise.all(copies.map(async copy => {
            const performance = await CopyTrade.getPerformanceHistory(copy.id);
            return {
                ...copy,
                performance
            };
        }));
    }
};