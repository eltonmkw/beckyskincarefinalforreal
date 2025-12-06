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

// [FIXED] Redact sensitive fields from logs
function redactSensitive(obj) {
  if (!obj) return obj;
  const redacted = { ...obj };
  config.logging.redactPatterns.forEach(pattern => {
    if (pattern in redacted) {
      redacted[pattern] = '[REDACTED]';
    }
  });
  return redacted;
}

// [FIXED] Safe logging - no sensitive data
function logRequest(req, body) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (body && config.logging.level === 'debug') {
    // Only log non-sensitive fields
    console.log('Request body:', JSON.stringify(redactSensitive(body), null, 2));
  }
}

// [FIXED] Proper authentication with role checking
function authenticate(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '');
  
  // [FIXED] Don't log tokens
  console.log('Auth attempt received');
  
  if (config.validateApiKey(token)) {
    return { authenticated: true, user: users.getUser('demo-admin-1') };
  }
  return { authenticated: false, user: null };
}

// [FIXED] Check if user has required role
function hasRole(user, requiredRole) {
  if (!user || !user.role) return false;
  if (requiredRole === 'admin') return user.role === 'admin';
  return true;
}

// [FIXED] Validate and sanitize search input
function sanitizeSearchTerm(input) {
  if (typeof input !== 'string') return '';
  // Remove potentially dangerous characters
  return input
    .replace(/['";<>\\]/g, '') // Remove SQL injection characters
    .replace(/[^\w\s@.-]/g, '') // Keep only safe characters
    .trim()
    .substring(0, 100); // Limit length
}

// [FIXED] Use parameterized query pattern (simulated)
function buildUserQuery(searchTerm) {
  const sanitized = sanitizeSearchTerm(searchTerm);
  // In real apps, use parameterized queries
  return {
    sql: 'SELECT * FROM users WHERE name LIKE ? OR email LIKE ?',
    params: [`%${sanitized}%`, `%${sanitized}%`]
  };
}

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    let parsedBody = null;
    try {
      parsedBody = body ? JSON.parse(body) : null;
    } catch (e) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }
    
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
    
    // [FIXED] Admin endpoint with proper role check
    if (parsedUrl.pathname === '/admin/users') {
      const auth = authenticate(req);
      
      // [FIXED] Verify authentication AND admin role
      if (!auth.authenticated) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      
      if (!hasRole(auth.user, 'admin')) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: 'Forbidden - Admin role required' }));
        return;
      }
      
      // [FIXED] Don't expose config or secrets in response
      res.end(JSON.stringify({
        users: users.getAllUsers(),
        adminAccess: true
      }));
      return;
    }
    
    // Search endpoint
    if (parsedUrl.pathname === '/search') {
      const rawSearchTerm = parsedUrl.query.q || '';
      const sanitized = sanitizeSearchTerm(rawSearchTerm);
      
      // [FIXED] Use safe query building
      const query = buildUserQuery(sanitized);
      
      // In demo mode, just filter in-memory
      const results = users.getAllUsers().filter(u => 
        u.name.toLowerCase().includes(sanitized.toLowerCase()) ||
        u.email.toLowerCase().includes(sanitized.toLowerCase())
      );
      
      // [FIXED] Don't expose query details
      res.end(JSON.stringify({ 
        searchTerm: sanitized,
        results: results
      }));
      return;
    }
    
    // Login endpoint
    if (parsedUrl.pathname === '/login' && req.method === 'POST') {
      const { email, password } = parsedBody || {};
      
      // [FIXED] Don't log credentials
      console.log(`Login attempt for: ${email ? email.substring(0, 3) + '***' : 'unknown'}`);
      
      const allUsers = users.getAllUsers();
      const user = allUsers.find(u => u.email === email);
      
      if (user && config.validateAdminPassword(password)) {
        // [FIXED] Generate a session token, don't reuse API key
        const sessionToken = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        res.end(JSON.stringify({
          success: true,
          user: { id: user.id, name: user.name, role: user.role }, // [FIXED] Minimal user data
          token: sessionToken
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
  console.log('  GET  /admin/users  - Admin user list (requires auth + admin role)');
  console.log('  GET  /search?q=    - Search users (input sanitized)');
  console.log('  POST /login        - Login with email/password\n');
  
  // [FIXED] Don't log secrets at startup
  console.log('Security: Secrets loaded from environment variables\n');
});
