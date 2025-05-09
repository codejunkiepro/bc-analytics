const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const analysisRouter = require('./routes/analysis');
const userRouter = require('./routes/user');
const copyRouter = require('./routes/copy');
const performanceTracking = require('./services/performanceTracking');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analysis', analysisRouter);
app.use('/api/user', userRouter);
app.use('/api/copy', copyRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Schedule daily performance updates at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily performance update...');
  performanceTracking.updateDailyPerformance()
    .then(() => console.log('Daily performance update completed'))
    .catch(err => console.error('Error in daily update:', err));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});