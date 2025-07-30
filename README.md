# 🧠 Random Quote API

A simple and efficient backend-only API built with **Next.js (App Router)** that serves random quotes. Developed in **TypeScript**, fully tested with **Jest**, and deployed via **Vercel**.

- All quotes
- A specific quote by ID
- Random quote IDs for frontend consumption
- 
![CI](https://github.com/Fperezu96/random-quote-api/actions/workflows/ci.yml/badge.svg)

---
## 🚀 API Endpoints

| Method | Endpoint                  | Description                       |
|--------|---------------------------|-----------------------------------|
| GET    | `/api/quotes`             | Returns all quotes                |
| GET    | `/api/quotes/[id]`        | Returns a quote by ID             |
| GET    | `/api/quotes/random-ids`  | Returns a list of random quote IDs |

---

## 🧪 Running Tests

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run test in CI (coverage + pass)
npm run test:ci
```
---
## 🛠️ Tech Stack

- ✅ Next.js (API-only backend)
- ✅ TypeScript
- ✅ MongoDB with Mongoose
- ✅ Jest (98%+ coverage enforced)
- ✅ GitHub Actions CI/CD
- ✅ Vercel Deployment

---

## 🚀 Getting Started

### 📦 Installation

```bash
git clone 
npm install
```
