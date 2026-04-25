import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    res.status(400).json({ error: 'Email ya registrado' });
  }
});

router.post('/token', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(401).json({ message: 'Credenciales inválidas' });

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, isStaff: user.isStaff },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' },
  );
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
  res.json({ access: accessToken, refresh: refreshToken });
});

export default router;
