import express from 'express';
import { RegisterRoutes } from './routes';

const router = express.Router();

// Register the generated TSOA routes
RegisterRoutes(router);

export default router;
