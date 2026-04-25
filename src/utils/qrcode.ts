import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import logger from './logger';

const uploadDir = path.join(process.cwd(), 'uploads', 'qrcodes');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export async function generateQRCode(sku: string): Promise<string> {
  const filename = `qr_${sku}.png`;
  const filePath = path.join(uploadDir, filename);
  await QRCode.toFile(filePath, sku);
  logger.info(`QR generado para SKU ${sku}`);
  return `/uploads/qrcodes/${filename}`;
}
