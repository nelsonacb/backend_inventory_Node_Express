import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../../uploads/qrcodes');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export async function generateQRCode(sku: string): Promise<string> {
  const filename = `qr_${sku}.png`;
  const filePath = path.join(uploadDir, filename);
  await QRCode.toFile(filePath, sku);
  return `/uploads/qrcodes/${filename}`;
}
