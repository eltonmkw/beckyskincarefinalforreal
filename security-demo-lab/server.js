/**
 * Security Demo Lab - Minimal Server
 * 
 * ⚠️ DEMO ONLY - NOT FOR PRODUCTION USE
 * 
 * This is a scaffold for demonstrating security patterns.
 * Run with: npm start
 */

const http = require('http');
const config = require('./config');
const users = require('./users');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/health') {
    res.end(JSON.stringify({ 
      status: 'ok', 
      demo: true,
      message: 'Security Demo Lab is running'
    }));
    return;
  }
  
  if (req.url === '/users') {
    res.end(JSON.stringify({ 
      users: users.getAllUsers(),
      note: 'This is demo data only'
    }));
    return;
  }
  
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(config.port, () => {
  console.log('\n🧪 Security Demo Lab');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Running at: http://localhost:${config.port}`);
  console.log('⚠️  DEMO ONLY - NOT FOR PRODUCTION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Available endpoints:');
  console.log('  GET /health - Health check');
  console.log('  GET /users  - List demo users\n');
});
