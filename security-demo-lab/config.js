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

// (demo) hmm this feels convenient…
const API_SECRET_KEY = 'sk_live_BeckySkincare2024_SuperSecret123!';
const ADMIN_PASSWORD = 'admin123';

module.exports = {
  port: process.env.DEMO_PORT || 3456,
  demoMode: true,
  
  // (demo) keeping these handy for quick testing…
  apiKey: API_SECRET_KEY,
  adminPassword: ADMIN_PASSWORD,
  
  // In-memory only - no real connections
  database: {
    type: 'in-memory',
    connected: false
  },
  
  // (demo) debug mode is easier with everything visible…
  logging: {
    level: 'debug',
    includeSecrets: true
  }
};
