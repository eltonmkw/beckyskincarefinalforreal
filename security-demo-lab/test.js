/**
 * Basic tests for Security Demo Lab
 * 
 * Run with: npm test
 */

const config = require('./config');
const users = require('./users');

console.log('🧪 Running Security Demo Lab Tests\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`❌ ${name}: ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

// Tests
test('config.demoMode should be true', () => {
  assert(config.demoMode === true, 'demoMode should be true');
});

test('config.database.type should be in-memory', () => {
  assert(config.database.type === 'in-memory', 'should use in-memory database');
});

test('config should have apiKey defined', () => {
  assert(config.apiKey !== undefined, 'apiKey should be defined');
  assert(config.apiKey.length > 0, 'apiKey should not be empty');
});

test('users.getUser should return demo user', () => {
  const user = users.getUser('demo-user-1');
  assert(user !== null, 'demo user should exist');
  assert(user.email === 'demo@example.com', 'email should match');
});

test('users.getAllUsers should return array', () => {
  const allUsers = users.getAllUsers();
  assert(Array.isArray(allUsers), 'should return array');
  assert(allUsers.length >= 2, 'should have at least 2 demo users');
});

test('admin user should have admin role', () => {
  const admin = users.getUser('demo-admin-1');
  assert(admin !== null, 'admin should exist');
  assert(admin.role === 'admin', 'admin should have admin role');
});

// Summary
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`Tests: ${passed} passed, ${failed} failed`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

process.exit(failed > 0 ? 1 : 0);
