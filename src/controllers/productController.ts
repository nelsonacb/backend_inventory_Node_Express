import { Request, Response } from 'express';
import * as productService from '../services/productService';

export const createProduct = async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body, req.file);
  res.status(201).json(product);
};

export const getAllProducts = async (req: Request, res: Response) => {
  const { search, category } = req.query;
  const products = await productService.getAllProducts(
    search as string,
    category ? Number(category) : undefined,
  );
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const product = await productService.getProductById(id);
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const updated = await productService.updateProduct(id, req.body, req.file);
  res.json(updated);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await productService.deleteProduct(id);
  res.status(204).send();
};

export const lookupByBarcode = async (req: Request, res: Response) => {
  const { barcode } = req.query;
  if (!barcode) throw new Error('Se requiere barcode');
  const product = await productService.lookupByBarcode(barcode as string);
  res.json(product);
};
