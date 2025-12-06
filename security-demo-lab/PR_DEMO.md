# Pull Request: Security Demo Lab

## 📋 What Changed

This PR adds an isolated **security demo lab** for the BeckySkincare hackathon. The demo showcases common security anti-patterns and their fixes.

### Commits Overview

| Commit | Description |
|--------|-------------|
| `chore: add security demo lab scaffold` | Created isolated `/security-demo-lab` folder with production guard, in-memory data store, and basic server |
| `demo: add intentionally flawed patterns` | Added 5 security anti-patterns for code review tools to flag |
| `fix: address CodeRabbit findings` | Applied security best practices to fix all issues |

---

## 🔍 What CodeRabbit Found

The demo intentionally introduced these common security issues:

1. **Hardcoded Secrets** 🔑
   - API key and admin password stored directly in source code
   - Secrets logged at startup and in debug output

2. **Missing Authorization Check** 🚫
   - Admin endpoint only checked "has token" not "is admin"
   - Any authenticated user could access admin resources

3. **Unsafe Input Handling** ⚠️
   - Search query built via string concatenation
   - No input validation or sanitization

4. **Overly-Verbose Logging** 📝
   - Passwords and tokens logged in plaintext
   - Auth tokens visible in console output

5. **Secrets in API Responses** 📤
   - Config and secrets returned in JSON responses
   - API key reused as session token

---

## ✅ How We Fixed It

| Issue | Fix Applied |
|-------|-------------|
| Hardcoded secrets | Moved to environment variables via `process.env` |
| Missing role check | Added `hasRole()` function, 403 for non-admins |
| Unsafe input | Added `sanitizeSearchTerm()` with allowlist |
| Verbose logging | Added `redactSensitive()` helper, removed token logs |
| Secrets in responses | Removed config from JSON, generate session tokens |

### Key Code Changes

**Before:**
```javascript
const API_SECRET_KEY = 'sk_live_BeckySkincare2024_SuperSecret123!';
console.log(`Auth attempt with token: ${token}`);
```

**After:**
```javascript
const API_SECRET_KEY = process.env.DEMO_API_KEY || 'demo-only-key';
console.log('Auth attempt received');
```

---

## 🎓 Takeaways

1. **Secrets belong in environment variables** — Never commit credentials. Use `.env` files, secrets managers, or CI/CD secrets.

2. **Authorization ≠ Authentication** — Logging in proves identity; authorization checks prove permission. Always verify both.

3. **Trust nothing from users** — Validate, sanitize, and limit all user input. Use parameterized queries.

4. **Log with care** — Sensitive data in logs becomes a liability. Redact passwords, tokens, and PII.

---

## 🧪 How to Test

```bash
cd security-demo-lab
npm install
npm test   # Run test suite
npm start  # Start demo server
```

Visit `http://localhost:3456/health` to verify the server is running.

---

## ⚠️ Safety Notes

- All code is isolated in `/security-demo-lab`
- Production guard blocks running with `NODE_ENV=production`
- Uses in-memory data only (no real database connections)
- Demo credentials are non-functional placeholders

---

*Created for BeckySkincare Hackathon Demo* 🧴✨
