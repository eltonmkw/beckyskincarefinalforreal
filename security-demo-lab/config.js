/**
 * Configuration for Security Demo Lab
 * 
 * ⚠️ DEMO ONLY - NOT FOR PRODUCTION USE
 */

// Production guard - refuse to run in production
if (process.env.NODE_ENV === 'production') {
  console.error('\n❌ DEMO ONLY — NOT FOR PROD\n');
  console.error('This demo contains intentionally flawed code patterns.');
  console.error('It must not be deployed to production environments.\n');
  process.exit(1);
}

// [FIXED] Secrets now come from environment variables
// In real apps, use a secrets manager or .env file (not committed)
const API_SECRET_KEY = process.env.DEMO_API_KEY || 'demo-only-key';
const ADMIN_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || 'demo-only-password';

module.exports = {
  port: process.env.DEMO_PORT || 3456,
  demoMode: true,
  
  // [FIXED] Secrets are accessed via getters, not exposed directly
  getApiKey: () => API_SECRET_KEY,
  validateApiKey: (key) => key === API_SECRET_KEY,
  validateAdminPassword: (password) => password === ADMIN_PASSWORD,
  
  // In-memory only - no real connections
  database: {
    type: 'in-memory',
    connected: false
  },
  
  // [FIXED] Secure logging settings
  logging: {
    level: 'info',
    includeSecrets: false, // Never log secrets
    redactPatterns: ['password', 'token', 'apiKey', 'secret']
  }
};
