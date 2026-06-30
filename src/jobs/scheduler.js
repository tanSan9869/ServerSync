import cron from "node-cron";
import pool from "../config/db.js";
import { pingServer,getSystemMetrics } from "../services/healthChecker.js";
import { evaluateThresholds,createDownAlert } from "../services/alertService.js";

async function checkAllServers(){
    const [servers] = await pool.query('SELECT * FROM servers;');

    for(const server of servers){
        const pingResult = await pingServer(server);
        const status = pingResult.isUp ? 'up' : 'down';

        await pool.query('UPDATE servers SET status = ? WHERE id = ?', [status,server.id]);

        if(!pingResult.isUp){
            await createDownAlert(server.id);
            continue;
        }

        const metrics = await getSystemMetrics();
        
        //extra query for duplicates

        await pool.query(
            'INSERT INTO metrics (server_id,cpu_usage,memory_usage,disk_usage,uptime_seconds) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE cpu_usage = ?,memory_usage = ?,disk_usage = ?,uptime_seconds = ?',
            [server.id,metrics.cpuUsage,metrics.memoryUsage,metrics.diskUsage,metrics.upTimeSeconds,metrics.cpuUsage,metrics.memoryUsage,metrics.diskUsage,metrics.upTimeSeconds]
        );

        await evaluateThresholds(server.id,metrics);
    }
}

function startScheduler(){
    const interval = process.env.POLL_INTERVAL || 30;
    //Runs every N seconds
    cron.schedule(`*/${interval} * * * * *`,()=>{
        console.log(`[scheduler] Running health check at ${new Date().toISOString()}`);
        checkAllServers().catch(err => console.error('[scheduler] Error: ',err));
    });
    console.log(`[scheduler] Started — polling every ${interval}s`);
}

export {startScheduler,checkAllServers};