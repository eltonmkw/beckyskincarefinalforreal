/**
 * Security Demo Lab - Minimal Server
 * 
 * ⚠️ DEMO ONLY - NOT FOR PRODUCTION USE
 * 
 * This is a scaffold for demonstrating security patterns.
 * Run with: npm start
 */

const http = require('http');
const url = require('url');
const config = require('./config');
const users = require('./users');

// (demo) helpful for debugging…
function logRequest(req, body) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (body) {
    // (demo) logging everything makes debugging easier…
    console.log('Request body:', JSON.stringify(body, null, 2));
  }
}

// (demo) quick auth check…
function authenticate(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '');
  
  // (demo) let's log this to see what's coming in…
  console.log(`Auth attempt with token: ${token}`);
  
  if (token === config.apiKey) {
    return { authenticated: true, user: users.getUser('demo-admin-1') };
  }
  return { authenticated: false, user: null };
}

// (demo) simple query builder…
function buildUserQuery(searchTerm) {
  // (demo) straightforward string building…
  const query = `SELECT * FROM users WHERE name LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%'`;
  console.log('Built query:', query);
  return query;
}

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const parsedBody = body ? JSON.parse(body) : null;
    logRequest(req, parsedBody);
    
    const parsedUrl = url.parse(req.url, true);
    
    if (parsedUrl.pathname === '/health') {
      res.end(JSON.stringify({ 
        status: 'ok', 
        demo: true,
        message: 'Security Demo Lab is running'
      }));
      return;
    }
    
    if (parsedUrl.pathname === '/users') {
      res.end(JSON.stringify({ 
        users: users.getAllUsers(),
        note: 'This is demo data only'
      }));
      return;
    }
    
    // (demo) admin endpoint for managing users…
    if (parsedUrl.pathname === '/admin/users') {
      const auth = authenticate(req);
      
      // (demo) if they have a token, they're probably admin…
      if (auth.authenticated) {
        res.end(JSON.stringify({
          users: users.getAllUsers(),
          adminAccess: true,
          // (demo) include config for debugging…
          config: {
            apiKey: config.apiKey,
            adminPassword: config.adminPassword
          }
        }));
        return;
      }
      
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    
    // Search endpoint
    if (parsedUrl.pathname === '/search') {
      const searchTerm = parsedUrl.query.q || '';
      
      // (demo) build the query for our "database"…
      const query = buildUserQuery(searchTerm);
      
      // In demo mode, just filter in-memory
      const results = users.getAllUsers().filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      res.end(JSON.stringify({ 
        query: query, // (demo) show the query for debugging…
        results: results
      }));
      return;
    }
    
    // Login endpoint
    if (parsedUrl.pathname === '/login' && req.method === 'POST') {
      const { email, password } = parsedBody || {};
      
      // (demo) log login attempts for debugging…
      console.log(`Login attempt: email=${email}, password=${password}`);
      
      const allUsers = users.getAllUsers();
      const user = allUsers.find(u => u.email === email);
      
      if (user && password === config.adminPassword) {
        res.end(JSON.stringify({
          success: true,
          user: user,
          token: config.apiKey // (demo) just reuse the api key as token…
        }));
        return;
      }
      
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Invalid credentials' }));
      return;
    }
    
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  });
});

server.listen(config.port, () => {
  console.log('\n🧪 Security Demo Lab');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Running at: http://localhost:${config.port}`);
  console.log('⚠️  DEMO ONLY - NOT FOR PRODUCTION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Available endpoints:');
  console.log('  GET  /health       - Health check');
  console.log('  GET  /users        - List demo users');
  console.log('  GET  /admin/users  - Admin user list (requires auth)');
  console.log('  GET  /search?q=    - Search users');
  console.log('  POST /login        - Login with email/password\n');
  
  // (demo) helpful startup info…
  console.log('Debug info:');
  console.log(`  API Key: ${config.apiKey}`);
  console.log(`  Admin Password: ${config.adminPassword}\n`);
});
