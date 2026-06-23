import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const user = await authService.registerUser(email, password, name);
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await authService.loginUser(email, password);
  res.json(tokens);
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const user = await authService.getUserById(userId as number);
  res.json(user);
};

export const refresh = async (req: Request, res: Response) => {
  const { refresh } = req.body;
  if (!refresh)
    return res.status(400).json({ error: 'Refresh token requerido' });
  try {
    const tokens = await authService.refreshAccessToken(refresh);
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};
