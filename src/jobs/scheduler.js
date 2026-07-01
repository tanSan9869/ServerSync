import cron from "node-cron";
import pool from "../config/db.js";
import { pingServer,getSystemMetrics } from "../services/healthChecker.js";
import { evaluateThresholds,createDownAlert } from "../services/alertService.js";

async function checkAllServers() {
  const [servers] = await pool.query('SELECT * FROM servers');
//   console.log(`[scheduler] Found ${servers.length} server(s) to check`);  // ADD THIS

  for (const server of servers) {
    console.log(`[scheduler] Checking ${server.name} (${server.host}:${server.port})`);  // ADD THIS
    const pingResult = await pingServer(server);
    // console.log(`[scheduler] Ping result:`, pingResult);  // ADD THIS

    const status = pingResult.isUp ? 'up' : 'down';
    await pool.query('UPDATE servers SET status = ? WHERE id = ?', [status, server.id]);

    if (!pingResult.isUp) {
      await createDownAlert(server.id);
      continue;
    }

    const metrics = await getSystemMetrics();
    // console.log(`[scheduler] Metrics collected:`, metrics);  // ADD THIS

    await pool.query(
      `INSERT INTO metrics (server_id, cpu_usage, memory_usage, disk_usage, uptime_seconds) 
       VALUES (?, ?, ?, ?, ?)`,
      [server.id, metrics.cpuUsage, metrics.memoryUsage, metrics.diskUsage, metrics.uptimeSeconds]
    );
    // console.log(`[scheduler] Metrics inserted for server ${server.id}`);  // ADD THIS

    await evaluateThresholds(server.id, metrics);
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