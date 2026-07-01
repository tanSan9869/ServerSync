import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ServerSync API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
           background: #0f1117; color: #e2e8f0; padding: 40px; }
    h1 { font-size: 24px; color: #fff; margin-bottom: 4px; }
    .subtitle { color: #64748b; font-size: 14px; margin-bottom: 40px; }
    .section { margin-bottom: 32px; }
    .section h2 { font-size: 12px; text-transform: uppercase;
                  letter-spacing: 0.1em; color: #64748b; margin-bottom: 12px; }
    .endpoint { display: flex; align-items: flex-start; gap: 12px;
                padding: 12px 16px; border-radius: 8px;
                background: #1e2130; margin-bottom: 6px; }
    .method { font-size: 11px; font-weight: 700; padding: 2px 8px;
              border-radius: 4px; min-width: 52px; text-align: center;
              margin-top: 1px; flex-shrink: 0; }
    .get    { background: #0d3321; color: #34d399; }
    .post   { background: #1a2e05; color: #84cc16; }
    .delete { background: #3b0f0f; color: #f87171; }
    .patch  { background: #1a1a35; color: #818cf8; }
    .path   { font-family: monospace; font-size: 14px; color: #e2e8f0; }
    .desc   { font-size: 13px; color: #64748b; margin-top: 2px; }
    .badge  { display: inline-block; font-size: 11px; padding: 1px 8px;
              border-radius: 99px; background: #1e3a5f; color: #60a5fa;
              margin-left: 8px; vertical-align: middle; }
  </style>
</head>
<body>
  <h1>ServerSync API</h1>
  <p class="subtitle">Infrastructure Monitoring & Deployment Toolkit — v1.0.0</p>

  <div class="section">
    <h2>System</h2>
    <div class="endpoint">
      <span class="method get">GET</span>
      <div><div class="path">/health</div>
      <div class="desc">Service health check — used by Docker and Nginx</div></div>
    </div>
    <div class="endpoint">
      <span class="method get">GET</span>
      <div><div class="path">/docs</div>
      <div class="desc">This page</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Servers</h2>
    <div class="endpoint">
      <span class="method get">GET</span>
      <div><div class="path">/api/servers</div>
      <div class="desc">List all registered servers with current status</div></div>
    </div>
    <div class="endpoint">
      <span class="method post">POST</span>
      <div><div class="path">/api/servers</div>
      <div class="desc">Register a new server — body: { name, host, port }</div></div>
    </div>
    <div class="endpoint">
      <span class="method get">GET</span>
      <div><div class="path">/api/servers/:id</div>
      <div class="desc">Get a single server by ID</div></div>
    </div>
    <div class="endpoint">
      <span class="method delete">DELETE</span>
      <div><div class="path">/api/servers/:id</div>
      <div class="desc">Remove a server from monitoring</div></div>
    </div>
    <div class="endpoint">
      <span class="method post">POST</span>
      <div><div class="path">/api/servers/:id/ping</div>
      <div class="desc">Manually trigger an immediate health check</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Metrics</h2>
    <div class="endpoint">
      <span class="method get">GET</span>
      <div><div class="path">/api/servers/:id/metrics
        <span class="badge">?limit=50</span>
      </div>
      <div class="desc">Time-series CPU, memory, disk, uptime snapshots</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Alerts</h2>
    <div class="endpoint">
      <span class="method get">GET</span>
      <div><div class="path">/api/servers/:id/alerts
        <span class="badge">?resolved=false</span>
      </div>
      <div class="desc">Threshold breach alerts for a server</div></div>
    </div>
    <div class="endpoint">
      <span class="method patch">PATCH</span>
      <div><div class="path">/api/servers/:id/alerts/:alertId/resolve</div>
      <div class="desc">Mark an alert as resolved</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Logs</h2>
    <div class="endpoint">
      <span class="method get">GET</span>
      <div><div class="path">/api/logs
        <span class="badge">?serverId=1</span>
        <span class="badge">?type=cpu</span>
        <span class="badge">?resolved=false</span>
      </div>
      <div class="desc">Aggregated event logs across all servers</div></div>
    </div>
  </div>
</body>
</html>
  `);
});

export default router;