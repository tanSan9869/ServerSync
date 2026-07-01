import express from "express";
const serverRoutes = express.Router();

import {getAllServers, getServerById, createServer, deleteServer,triggerPing} from "../controllers/serverController.js";
import {getServerMetrics} from "../controllers/metricsController.js";
import {getServerAlerts, resolveAlert} from "../controllers/alertController.js";

serverRoutes.get('/',getAllServers);
serverRoutes.post('/',createServer);
serverRoutes.get('/:id',getServerById);
serverRoutes.delete('/:id',deleteServer);
serverRoutes.get('/:id/ping',triggerPing);
serverRoutes.get('/:id/metrics',getServerMetrics);
serverRoutes.get('/:id/alerts',getServerAlerts);
serverRoutes.put('/:id/alerts/:alertId/resolve',resolveAlert);

export default serverRoutes;