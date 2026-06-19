import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await categoryService.getAllCategories(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    const category = await categoryService.createCategory(name, color);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

export const getById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const category = await categoryService.getCategoryById(id);
    res.json(category);
  } catch (error) {
    if (error instanceof Error && error.message === 'Categoría no encontrada') {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
};

export const update = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const { name, color } = req.body;
    const updated = await categoryService.updateCategory(id, name, color);
    res.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === 'Categoría no encontrada') {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    await categoryService.deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === 'Categoría no encontrada') {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};
