import express from "express";
import {getLogs} from "../controllers/logController.js";

const logRoutes = express.Router();
logRoutes.get('/',getLogs);

export default logRoutes;