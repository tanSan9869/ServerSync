import { getAggregatedLogs } from "../services/logService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const getLogs = asyncHandler(async (req,res) => {
    const {serverId,type,resolved} = req.query;

    const filters = {}
    if(serverId) filters.serverId = serverId;
    if(type) filters.type = type;
    if(resolved !== undefined) filters.resolved = resolved === 'true' ? 1 : 0;

    const logs = await getAggregatedLogs(filters);
    res.json({success:true,count:logs.length,data:logs});
});

export {getLogs};