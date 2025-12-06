# 🧪 Security Demo Lab

> ⚠️ **DEMO ONLY — DO NOT DEPLOY** ⚠️

This folder contains code patterns for hackathon security demonstration purposes.
It shows before/after examples of common security issues found by code review tools.

## 🚫 Important Warnings

- **DO NOT** deploy this code to production
- **DO NOT** copy these patterns into real applications
- **DO NOT** use real credentials or connect to real services
- This is for **educational demonstration only**

## 🏃 How to Run Locally

```bash
cd security-demo-lab
npm install
npm start
```

The demo runs on `http://localhost:3456` and uses **in-memory data only**.

To configure secrets (optional for demo):
```bash
export DEMO_API_KEY="your-demo-key"
export DEMO_ADMIN_PASSWORD="your-demo-password"
npm start
```

## 🔒 Production Guard

This demo will **refuse to start** if `NODE_ENV=production`:

```
❌ DEMO ONLY — NOT FOR PROD
```

## 📁 Contents

- `server.js` - Demo server with security best practices applied
- `users.js` - In-memory user store (no real database)
- `config.js` - Secure configuration with environment variables
- `test.js` - Test suite verifying secure patterns

---

## 📚 What We Learned

1. **Never hardcode secrets** — Use environment variables or a secrets manager. Secrets in source code get committed, logged, and exposed.

2. **Always verify authorization, not just authentication** — Checking "is logged in" is not enough. Verify the user has the required role/permissions for each action.

3. **Sanitize all user input** — Never build queries or commands by concatenating user input. Use parameterized queries and input validation.

---

## 🔄 Before / After Summary

| Issue | Before (❌) | After (✅) |
|-------|------------|-----------|
| **Secrets** | Hardcoded in source | Environment variables |
| **Logging** | Logged passwords & tokens | Sensitive data redacted |
| **Auth Check** | Only checked "has token" | Verifies role is `admin` |
| **User Input** | Direct string concatenation | Sanitized & validated |
| **API Response** | Exposed secrets in JSON | Minimal data returned |

---

## 🎯 Purpose

This demo exists to:
1. Show what common security anti-patterns look like
2. Demonstrate how code review tools catch these issues
3. Provide a safe learning environment with clear fixes

---

*Created for BeckySkincare Hackathon Demo*
