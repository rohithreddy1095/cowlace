require('dotenv').config();
const { startReceiver } = require('./receiver');
const { createApp } = require('./api');

const TCP_PORT = parseInt(process.env.TCP_PORT) || 7700;
const HTTP_PORT = parseInt(process.env.HTTP_PORT) || 3000;

// Start TCP receiver for GPS trackers
startReceiver(TCP_PORT);

// Start HTTP API + dashboard
const app = createApp();
app.listen(HTTP_PORT, () => {
  console.log(`[api] HTTP server at http://localhost:${HTTP_PORT}`);
  console.log(`[api] Dashboard at http://localhost:${HTTP_PORT}/`);
});
