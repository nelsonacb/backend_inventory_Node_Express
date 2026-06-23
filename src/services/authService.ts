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

export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      isStaff: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) throw new Error('Usuario no encontrado');
  return user;
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new Error('Usuario no encontrado');
    const newAccess = jwt.sign(
      { id: user.id, email: user.email, isStaff: user.isStaff },
      env.JWT_SECRET,
      { expiresIn: '1d' },
    );
    return { access: newAccess };
  } catch (error) {
    throw new Error('Refresh token inválido o expirado');
  }
};
