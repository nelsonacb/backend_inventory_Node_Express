import { prisma } from '../lib/prisma';
import app from './app';
import { env } from './config';
import logger from './utils/logger';

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Conectado a PostgreSQL');
    app.listen(env.PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

startServer();
