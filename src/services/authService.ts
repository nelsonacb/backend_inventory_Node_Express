import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config';
import logger from '../utils/logger';
import { prisma } from '../../lib/prisma';

export const registerUser = async (
  email: string,
  password: string,
  name?: string,
) => {
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name },
  });
  logger.info(`Usuario registrado: ${email}`);
  return { id: user.id, email: user.email, name: user.name };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Credenciales inválidas');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Credenciales inválidas');

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, isStaff: user.isStaff },
    env.JWT_SECRET,
    { expiresIn: '1d' },
  );
  const refreshToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return { access: accessToken, refresh: refreshToken };
};
