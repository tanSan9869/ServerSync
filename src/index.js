import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import logRoutes from "./routes/logs.js";
import serverRoutes from "./routes/server.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { startScheduler } from "./jobs/scheduler.js";
import docsRoutes from "./routes/docs.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Routes (stubbed for now, filled in Phase 4)
app.get('/health',(req,res) =>{
    res.json({status:"ok", timestamp: new Date().toISOString()});
});

app.use('/api/servers',serverRoutes);
app.use('/api/logs',logRoutes);
app.use('/docs',docsRoutes);
// Error handler (Phase 4)
app.use((req,res)=>{
    res.status(404).json({success:false,error:"Route Not found"});
})

app.use(errorHandler);
// Scheduler (Phase 3)
startScheduler();

const PORT = process.env.PORT || 3000;
app.listen(PORT,() =>{
    console.log(`ServerSync running on port ${PORT}`);
});