/**
 * In-memory user store for demo purposes
 * 
 * ⚠️ DEMO ONLY - No real database connections
 */

// Simple in-memory store (resets on restart)
const users = new Map();

// Seed with demo users
users.set('demo-user-1', {
  id: 'demo-user-1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user'
});

users.set('demo-admin-1', {
  id: 'demo-admin-1',
  name: 'Demo Admin',
  email: 'admin@example.com',
  role: 'admin'
});

module.exports = {
  getUser: (id) => users.get(id) || null,
  getAllUsers: () => Array.from(users.values()),
  createUser: (user) => {
    users.set(user.id, user);
    return user;
  },
  deleteUser: (id) => users.delete(id)
};
