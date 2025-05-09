const RiskAssessment = require('../models/RiskAssessment');

module.exports = {
    getRiskProfile: async (userId) => {
        const score = await RiskAssessment.calculateScore(userId);
        const history = await RiskAssessment.getHistory(userId);

        return {
            score,
            history
        };
    }
};