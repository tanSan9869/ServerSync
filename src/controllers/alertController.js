import pool from "../config/db.js";
import { AppError,asyncHandler } from "../middleware/errorHandler.js";

const getServerAlerts = asyncHandler(async (req,res) =>{
    const {id} = req.params;
    const {resolved} = req.query;

    const [server] = await pool.query('SELECT * FROM servers WHERE id = ?',[id]);
    if(server.length === 0) throw new AppError('Server not found',404);

    let query = 'SELECT * FROM alerts WHERE server_id = ?';
    const params = [id]

    if(resolved !== undefined) {
        query += ' AND resolved = ?';
        params.push(resolved === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC LIMIT 50';

    const [alerts] = await pool.execute(query,params);
    res.json({success:true,count:alerts.length,data:alerts});
});

const resolveAlert = asyncHandler(async (req,res) =>{
    const [result] = await pool.query('UPDATE alerts SET resolved = 1 WHERE id = ?',[req.params.id]);
    if(result.affectedRows === 0) throw new AppError('Alert not found',404);
    res.json({success:true,data:{id:req.params.id,resolved:true},message:'Alert resolved successfully'});
});

export {getServerAlerts,resolveAlert};