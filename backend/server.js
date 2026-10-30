const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { randomBytes } = require('crypto');
const connectDB = require('./config/db');
const { localFileTestMode } = require('./config/localTestMode');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });
process.env.NODE_ENV ||= 'development';

if (process.env.NODE_ENV === 'development') {
  process.env.ALLOW_TEST_SUBMISSIONS ||= 'true';
  if (!process.env.MONGODB_URI) {
    process.env.JWT_SECRET ||= randomBytes(32).toString('hex');
  }
}

if (!localFileTestMode()) {
  connectDB();
}

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Static folder for uploads
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

const host = process.env.NODE_ENV === 'development' ? '127.0.0.1' : undefined;
app.listen(PORT, host, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  if (!localFileTestMode()) {
    const { startColdEmailEngine } = require('./utils/coldEmailScheduler');
    startColdEmailEngine();
  } else {
    console.log('Local test submissions are stored in backend/data/test-submissions.json.');
  }
});
