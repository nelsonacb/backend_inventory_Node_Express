# 📦 Backend de Inventario – Node.js + Express + Prisma

Sistema de gestión de inventario para pequeños negocios (retail, bodegas, almacenes).  
Este backend provee una **API REST** completa para manejar productos, categorías, stock, movimientos, alertas y reportes, con autenticación JWT y soporte para códigos QR y escaneo desde móvil.

## 🚀 Tecnologías principales

- **Node.js** + **Express** – Servidor web rápido y minimalista.
- **TypeScript** – Código tipado y mantenible.
- **Prisma ORM** – Modelado de datos y migraciones seguras.
- **PostgreSQL** – Base de datos relacional.
- **JWT** – Autenticación stateless.
- **Multer** – Subida de imágenes.
- **QRCode** – Generación de códigos QR para cada producto.

## 📁 Estructura del proyecto

src/
├── routes/ (definición de endpoints)
│ ├── authRoutes.ts
│ ├── warehouseRoutes.ts
│ ├── categoryRoutes.ts
│ ├── productRoutes.ts
│ ├── stockRoutes.ts
│ ├── movementRoutes.ts
│ ├── alertRoutes.ts
│ └── dashboardRoutes.ts
├── middlewares/ (autenticación, logs, etc.)
├── utils/ (generador de QR, helpers)
├── index.ts (punto de entrada)
prisma/
├── schema.prisma (modelos de la base de datos)
└── migrations/ (historial de cambios en la BD)

## ⚙️ Requisitos previos

- Node.js **18+**
- PostgreSQL **14+** (crea una base de datos llamada `inventory_db`, por ejemplo)
- npm o yarn

## 🧩 Endpoints principales

Método Endpoint Descripción
POST /api/auth/register Registrar un nuevo usuario
POST /api/auth/token Obtener token JWT (login)
GET /api/warehouses Listar almacenes
POST /api/warehouses Crear almacén
GET /api/categories Listar categorías
POST /api/categories Crear categoría
GET /api/products Listar productos (con filtros y búsqueda)
POST /api/products Crear producto (genera QR automáticamente)
GET /api/products/lookup/by-barcode?barcode=XXX Escanear código de barras o SKU
GET /api/stocks Ver stock por producto/almacén
POST /api/movements Registrar entrada/salida (actualiza stock y alertas)
GET /api/alerts Ver alertas de bajo stock
PATCH /api/alerts/:id/mark-as-read Marcar alerta como leída
GET /api/dashboard/stats Estadísticas para el dashboard
GET /api/dashboard/sales Reporte de ventas (con gráfico)
GET /api/dashboard/export-csv Descargar histórico de movimientos en CSV
