import axios from "axios";
import os from "os";
import checkDiskSpace from "check-disk-space";

async function pingServer(server){
    const start = Date.now();
    try {
        const response = await axios.get(`http://${server.host}:${server.port}/health`,{timeout: parseInt(process.env.ALERT_TIMEOUT_MS) || 10000});
        return {
            isUp: response.status === 200,
            responseTimeMs : Date.now() - start
        };
    } catch (error) {
        return {isUp: false, responseTimeMs : null, error: error.message};
    }
}

async function getSystemMetrics(){
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;
    const cpuUsage = calculateCpuUsage(os.cpus());
    const diskUsage = await getDiskUsage();

    return {
        cpuUsage : parseFloat(cpuUsage.toFixed(2)),
        memoryUsage : parseFloat(memoryUsage.toFixed(2)),
        diskUsage,
        upTimeSeconds: Math.floor(os.uptime())
    };
}

function calculateCpuUsage(cpus){
    let totalIdle = 0,totalTick = 0;
    cpus.forEach(cpu =>{
        for(const type in cpu.times) totalTick += cpu.times[type];
        totalIdle += cpu.times.idle;
    });
    const idle = totalIdle/cpus.length;
    const total = totalTick/cpus.length;
    return 100 - (100*idle/total);
}

async function getDiskUsage(){
    try {
        const path = process.platform === "win32" ? 'C:' : '/';
        const diskInfo = await checkDiskSpace(path);
        const used = diskInfo.size - diskInfo.free;
        return parseFloat(((used/diskInfo.size)*100).toFixed(2));
    } catch (error) {
        return null;
    }
}

export {pingServer, getSystemMetrics,getDiskUsage};