const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const analysisRouter = require('./routes/analysis');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analysis', analysisRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});