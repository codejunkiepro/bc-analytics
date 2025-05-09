const performanceTracking = require('../services/performanceTracking');

module.exports = {
  startCopying: async (req, res) => {
    try {
      const { followerId, traderId, initialAmount } = req.body;
      const copyId = await performanceTracking.startCopying(followerId, traderId, initialAmount);
      res.json({ success: true, copyId });
    } catch (error) {
      console.error('Error starting copy:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  stopCopying: async (req, res) => {
    try {
      const { followerId, traderId } = req.body;
      await performanceTracking.stopCopying(followerId, traderId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error stopping copy:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  getPerformance: async (req, res) => {
    try {
      const { followerId } = req.params;
      const performance = await performanceTracking.getCopyPerformance(followerId);
      res.json(performance);
    } catch (error) {
      console.error('Error getting copy performance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};