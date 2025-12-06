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

module.exports = {
  port: process.env.DEMO_PORT || 3456,
  demoMode: true,
  
  // In-memory only - no real connections
  database: {
    type: 'in-memory',
    connected: false
  }
};
