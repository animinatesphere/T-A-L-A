const localFileTestMode = () =>
  process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI;

module.exports = { localFileTestMode };
