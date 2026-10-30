const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Static folder for uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/award-books', require('./routes/awardBookRoutes'));
app.use('/api/podcasts', require('./routes/podcastRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/judges', require('./routes/judgeRoutes'));
app.use('/api/cold-email', require('./routes/coldEmailRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  const { startColdEmailEngine } = require('./utils/coldEmailScheduler');
  startColdEmailEngine();
});
