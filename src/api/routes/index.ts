import express from 'express';
import health from '../health';

const routes = express();

//Routes
const HEALTH = '/health';

//Link routes with endpoints
routes.use(HEALTH, health)

export default routes
