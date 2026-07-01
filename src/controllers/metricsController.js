import pool from "../config/db.js";
import { AppError,asyncHandler } from "../middleware/errorHandler.js";

const getServerMetrics = asyncHandler(async (req,res) =>{
    const {id} = req.params;
    const {limit=10} = req.query;
    const safeLimit = parseInt(limit) || 50;

    const [server] = await pool.execute('SELECT * FROM servers WHERE id = ?',[id]);
    if(server.length === 0) throw new AppError('Server not found',404);

    const [metrics] = await pool.query(
  `SELECT * FROM metrics WHERE server_id = ? ORDER BY recorded_at DESC LIMIT ${safeLimit}`,
  [id]
);
    res.json({success:true,count:metrics.length,data:metrics});
});

export {getServerMetrics};