import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { startScheduler } from "./jobs/scheduler.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Routes (stubbed for now, filled in Phase 4)
app.get('/health',(req,res) =>{
    res.json({status:"ok", timestamp: new Date().toISOString()});
});

// Error handler (Phase 4)

// Scheduler (Phase 3)
startScheduler();

const PORT = process.env.PORT || 3000;
app.listen(PORT,() =>{
    console.log(`ServerSync running on port ${PORT}`);
});