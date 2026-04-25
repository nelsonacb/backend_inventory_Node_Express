import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { generateQRCode } from '../utils/qrcode';
import multer from 'multer';
import path from 'path';
import { prisma } from '../../lib/prisma';

const router = Router();
const storage = multer.diskStorage({
  destination: 'uploads/products/',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Obtener todos los productos (con search y filtro)
router.get('/', authenticateToken, async (req, res) => {
  const { search, category } = req.query;
  let where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { sku: { contains: search as string, mode: 'insensitive' } },
      { barcode: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  if (category) where.categoryId = parseInt(category as string);
  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      stocks: { include: { warehouse: true } },
    },
  });
  // Calcular stock total manualmente
  const result = products.map((p) => ({
    ...p,
    total_stock: p.stocks.reduce((sum, s) => sum + s.quantity, 0),
  }));
  res.json(result);
});

// Crear producto (con subida de imagen y QR)
router.post(
  '/',
  authenticateToken,
  upload.single('image'),
  async (req, res) => {
    const { name, sku, barcode, category, price, threshold, description } =
      req.body;
    const image = req.file ? `/uploads/products/${req.file.filename}` : null;
    // Generar QR
    const qrCodePath = await generateQRCode(sku);
    try {
      const product = await prisma.product.create({
        data: {
          name,
          sku,
          barcode,
          categoryId: category ? parseInt(category) : null,
          price: parseFloat(price),
          threshold: parseInt(threshold),
          description,
          image,
          qrCode: qrCodePath,
        },
      });
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Obtener producto por ID
router.get('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, stocks: { include: { warehouse: true } } },
  });
  if (!product) return res.status(404).json({ message: 'No encontrado' });
  const total_stock = product.stocks.reduce((sum, s) => sum + s.quantity, 0);
  res.json({ ...product, total_stock });
});

// Actualizar producto
router.put(
  '/:id',
  authenticateToken,
  upload.single('image'),
  async (req, res) => {
    const id = parseInt(req.params.id as string);
    const { name, sku, barcode, category, price, threshold, description } =
      req.body;
    const image = req.file
      ? `/uploads/products/${req.file.filename}`
      : undefined;
    // Si cambia el SKU, regenerar QR
    let qrCodePath;
    if (sku) {
      const existing = await prisma.product.findUnique({ where: { id } });
      if (existing && existing.sku !== sku) {
        qrCodePath = await generateQRCode(sku);
      }
    }
    try {
      const updated = await prisma.product.update({
        where: { id },
        data: {
          name,
          sku,
          barcode,
          categoryId: category ? parseInt(category) : null,
          price: parseFloat(price),
          threshold: parseInt(threshold),
          description,
          image,
          qrCode: qrCodePath,
        },
      });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Eliminar producto
router.delete('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string);
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
});

// Escaneo por código de barras/SKU
router.get('/lookup/by-barcode', authenticateToken, async (req, res) => {
  const barcode = req.query.barcode as string;
  if (!barcode) return res.status(400).json({ error: 'Se requiere barcode' });
  const product = await prisma.product.findFirst({
    where: { OR: [{ barcode }, { sku: barcode }] },
    include: { category: true, stocks: { include: { warehouse: true } } },
  });
  if (!product)
    return res.status(404).json({ error: 'Producto no encontrado' });
  const total_stock = product.stocks.reduce((sum, s) => sum + s.quantity, 0);
  res.json({ ...product, total_stock });
});

export default router;
