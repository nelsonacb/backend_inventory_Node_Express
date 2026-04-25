import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import warehouseRoutes from './routes/warehouseRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import stockRoutes from './routes/stockRoutes';
import movementRoutes from './routes/movementRoutes';
import alertRoutes from './routes/alertRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // para imágenes y QR

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
