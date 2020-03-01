import express from 'express';
import health from '../health';
import v1 from '../v1/routes';

const router = express.Router();

//Routes
const HEALTH = '/health';
const V1 = '/v1';

//Health route endpoint
router.get(HEALTH, health)

//Add Version 1 routes
router.use(V1, v1)

export default router
