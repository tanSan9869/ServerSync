import pool from "../config/db.js";
import { AppError,asyncHandler } from "../middleware/errorHandler.js";
import {pingServer} from "../services/healthChecker.js";

const getAllServers = asyncHandler(async (req,res)=>{
    const [servers] = await pool.query('SELECT * FROM servers ORDER BY created_at DESC LIMIT 50');
    res.json({success:true,count:servers.length,data:servers});
});

const getServerById = asyncHandler(async (req,res) =>{
    const [rows] = await pool.query('SELECT * FROM servers WHERE id = ?',[req.params.id]);
    if(rows.length ===0) throw new AppError('Server not found',404);
    res.json({success:true,data:rows[0]});
});

const createServer = asyncHandler(async (req,res) =>{
    const {name,host,port} = req.body;
    if(!name || !host){
        throw new AppError('Name and host are required',400);
    }

    const [result] = await pool.query('INSERT INTO servers (name,host,port) VALUES (?,?,?)',[name,host,port||80]);
    const [newServer] = await pool.query('SELECT * FROM servers WHERE id = ?',[result.insertId]);
    res.status(201).json({success:true,data:newServer[0]});
});

const deleteServer = asyncHandler(async (req,res) =>{
    const [result] = await pool.query('DELETE FROM servers WHERE id = ?',[req.params.id]);
    if(result.affectedRows === 0) throw new AppError('Server not found',404);
    res.json({success:true,message:'Server deleted successfully'});
})

const triggerPing = asyncHandler(async (req,res)=>{
    const [rows] = await pool.query('SELECT * FROM servers WHERE id = ?',[req.params.id]);
    if(rows.length === 0) throw new AppError('Server not found',404);

    const result = await pingServer(rows[0]);
    const status = result.isUp ? 'up' : 'down';
    await pool.query('UPDATE servers SET status = ? WHERE id = ?',[status,req.params.id]);
    res.json({success:true,data:{...result,status}});
});

export {getAllServers,getServerById,createServer,deleteServer,triggerPing};