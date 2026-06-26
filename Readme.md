# 📦 Inventory Management Backend

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-blueviolet)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org/)

A robust REST API for small retail inventory management built with Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Features

- User authentication (JWT) with email/password
- CRUD for Products, Categories, Warehouses
- Stock movements (purchase, sale, adjustment, return, transfer)
- Automatic low‑stock alerts
- QR code generation per product
- Dashboard statistics and sales reports
- Multi‑warehouse support
- CSV export of movement history

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

## 🔧 Installation

```bash
git clone <your-repo-url>
cd backend
npm install
```

## ⚙️ Environment Variables

Create a .env file in the root directory:
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
JWT_SECRET=your_super_secret_key

## 🗄️ Database Setup

npx prisma migrate dev --name init
npx prisma generate

## ▶️ Running the Server

Development: `bash npm run dev `

Production:

```bash
npm run build
npm start
```

The server runs at http://localhost:5000

# 📌 API Endpoints

Method Endpoint Description
POST /api/auth/register Register a new user
POST /api/auth/token Login (get JWT)
GET /api/auth/me Get current user profile
POST /api/auth/refresh Refresh access token

## Warehouses

Method Endpoint Description
GET /api/warehouses List all warehouses
POST /api/warehouses Create a warehouse
PUT /api/warehouses/:id Update a warehouse
DELETE /api/warehouses/:id Delete a warehouse

## Categories

Method Endpoint Description
GET /api/categories List categories
POST /api/categories Create a category
PUT /api/categories/:id Update category
DELETE /api/categories/:id Delete category

## Products

Method Endpoint Description
GET /api/products List products (with filters & search)
POST /api/products Create a product (auto‑generates QR)
GET /api/products/:id Get product details
PUT /api/products/:id Update product
DELETE /api/products/:id Delete product
GET /api/products/lookup/by-barcode?barcode=XXX Lookup by barcode or SKU

## Stock

Method Endpoint Description
GET /api/stocks Get stock by product/warehouse

## Stock Movements

Method Endpoint Description
GET /api/movements List movements (with filters)
POST /api/movements Register a movement (updates stock & alerts)

## Alerts

Method Endpoint Description
GET /api/alerts Get low‑stock alerts
PATCH /api/alerts/:id/mark-as-read Mark alert as read

## Dashboard

Method Endpoint Description
GET /api/dashboard/stats Dashboard statistics
GET /api/dashboard/sales Sales report (chart data)
GET /api/dashboard/export-csv Export movement history as CSV

## 🛠️ Tech Stack

Runtime: Node.js

Framework: Express

ORM: Prisma

Database: PostgreSQL

Authentication: JWT (jsonwebtoken)

Validation: (custom middleware)

QR Code: qrcode

Logging: Winston (custom logger)

File Upload: Multer

## 📄 License

MIT
