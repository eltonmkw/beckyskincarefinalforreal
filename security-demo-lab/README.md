# 🧪 Security Demo Lab

> ⚠️ **DEMO ONLY — DO NOT DEPLOY** ⚠️

This folder contains **intentionally flawed code patterns** for hackathon demonstration purposes.
It is designed to showcase what security/code-review tools like CodeRabbit would flag.

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

## 🔒 Production Guard

This demo will **refuse to start** if `NODE_ENV=production`:

```
❌ DEMO ONLY — NOT FOR PROD
```

## 📁 Contents

- `server.js` - A minimal demo server with intentional security issues
- `users.js` - In-memory user store (no real database)
- `config.js` - Configuration with production guard

## 🎯 Purpose

This demo exists to:
1. Show what common security anti-patterns look like
2. Demonstrate how code review tools catch these issues
3. Provide a safe learning environment

---

*Created for BeckySkincare Hackathon Demo*
