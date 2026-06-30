import pool from "../config/db.js";

const THRESHOLDS = {
    cpu : parseFloat(process.env.ALERT_CPU_THRESHOLD) || 85,
    memory : parseFloat(process.env.ALERT_MEMORY_THRESHOLD) || 90,
    disk : parseFloat(process.env.ALERT_DISK_THRESHOLD) || 80
};

async function evaluateThresholds(serverId,metrics){
    const checks = [
        {type: 'cpu', value:metrics.cpuUsage,threshold:THRESHOLDS.cpu},
        {type: 'memory', value:metrics.memoryUsage,threshold:THRESHOLDS.memory},
        {type: 'disk', value:metrics.diskUsage,threshold:THRESHOLDS.disk}
    ];

    for (const check of checks){
        if(check.value != null && check.value > check.threshold){
            await createAlert(serverId,check.type,check.value,check.threshold);
        }
    }
}

async function createAlert(serverId,type,actualValue,threshold){
    const message = `${type.toUpperCase()} usage at ${actualValue}% exceeds threshold of ${threshold}%.`;

    await pool.query(
        `INSERT INTO alerts (server_id,type,message,threshold,actual_value) VALUES (?,?,?,?,?)`,
        [serverId,type,message,threshold,actualValue]
    );
    console.log(`🚨 ALERT: ${message} (server ${serverId})`);
}

async function createDownAlert(serverId){
    await pool.query(
        `INSERT INTO alerts (server_id,type,message) VALUES (?,'down',?)`,
        [serverId,`Server ${serverId} is not responding.`]
    );
    console.log(`🚨 ALERT: Server ${serverId} is DOWN`);
}

export {evaluateThresholds,createDownAlert};