import pool from "../config/db.js";

async function getAggregatedLogs(filters = {}){
    let query = `
    SELECT a.id,a.server_id,s.name AS server_name,a.type,a.message, a.resolved, a.created_at
    FROM alerts a
    JOIN servers s ON a.server_id = s.id
    WHERE 1=1
    `;
    const params=[];

    if(filters.serverId){
        query += ` AND a.server_id = ?`;
        params.push(filters.serverId);
    }
    if(filters.type){
        query += ` AND a.type = ?`;
        params.push(filters.type);
    }
    if(filters.resolved !== undefined){
        query += ` AND a.resolved = ?`;
        params.push(filters.resolved);
    }

    query += ` ORDER BY a.created_at DESC LIMIT 100`;

    const [rows] = await pool.query(query,params);
    return rows;
}

export {getAggregatedLogs};