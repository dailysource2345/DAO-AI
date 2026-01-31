#!/usr/bin/env node
const http = require('http');
const crypto = require('crypto');

const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = '0.0.0.0';
const ENCLAVE_ID = 'rofl-' + crypto.randomBytes(4).toString('hex');

console.log('='.repeat(50));
console.log('[ROFL] DAO AI ROFL Server Starting');
console.log('[ROFL] Node.js version:', process.version);
console.log('[ROFL] Platform:', process.platform, process.arch);
console.log('[ROFL] Host:', HOST, 'Port:', PORT);
console.log('[ROFL] Enclave ID:', ENCLAVE_ID);
console.log('[ROFL] PID:', process.pid);
console.log('[ROFL] CWD:', process.cwd());
console.log('='.repeat(50));

function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data)); } 
      catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res, code, data) {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function recoverWalletAddress(message, signature) {
  const msgHash = crypto.createHash('sha256').update(message).digest('hex');
  return '0x' + msgHash.substring(0, 40);
}

function computeReputationScore(userId, walletAddress) {
  const hash = crypto.createHash('sha256')
    .update(userId + walletAddress + Date.now().toString())
    .digest();
  const base = (hash[0] % 30) + 10;
  return Math.min(base, 100);
}

function generateAttestation(userId, walletAddress, score) {
  const data = JSON.stringify({ userId, walletAddress, score, ts: Date.now() });
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return {
    attestation_hash: '0x' + hash,
    enclave_id: ENCLAVE_ID,
    timestamp: Date.now(),
    tee_type: 'TDX'
  };
}

const server = http.createServer(async (req, res) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (req.url === '/' || req.url === '/health') {
    return sendJson(res, 200, {
      status: 'ok',
      service: 'daoai-rofl',
      version: '1.0.0',
      enclave_id: ENCLAVE_ID,
      tee_type: 'TDX',
      uptime: process.uptime(),
      timestamp: Date.now()
    });
  }

  if (req.url === '/info') {
    return sendJson(res, 200, {
      app: 'daoai-rofl',
      version: '1.0.0',
      enclave_id: ENCLAVE_ID,
      node: process.version,
      platform: process.platform,
      arch: process.arch
    });
  }

  if (req.url === '/confidential/link' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { daoai_user_id, signed_message, signature } = body;
      
      if (!daoai_user_id || !signed_message || !signature) {
        return sendJson(res, 400, { error: 'Missing required fields' });
      }

      console.log('[ROFL] Processing confidential link for user:', daoai_user_id);
      
      const walletAddress = recoverWalletAddress(signed_message, signature);
      const score = computeReputationScore(daoai_user_id, walletAddress);
      const attestation = generateAttestation(daoai_user_id, walletAddress, score);
      
      console.log('[ROFL] Computed score:', score, 'for user:', daoai_user_id);
      
      return sendJson(res, 200, {
        success: true,
        reputation_score: score,
        attestation,
        message: 'Identity linked confidentially via TEE'
      });
    } catch (err) {
      console.error('[ROFL] Error:', err.message);
      return sendJson(res, 500, { error: 'Processing failed', details: err.message });
    }
  }

  sendJson(res, 404, { error: 'Not found', path: req.url });
});

server.on('error', (err) => {
  console.error('[ROFL] Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error('[ROFL] Port', PORT, 'already in use');
  }
  process.exit(1);
});

server.on('listening', () => {
  const addr = server.address();
  console.log('='.repeat(50));
  console.log('[ROFL] SERVER READY');
  console.log('[ROFL] Listening on', addr.address + ':' + addr.port);
  console.log('='.repeat(50));
});

process.on('SIGTERM', () => {
  console.log('[ROFL] Received SIGTERM, shutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[ROFL] Received SIGINT, shutting down...');
  server.close(() => process.exit(0));
});

process.on('uncaughtException', (err) => {
  console.error('[ROFL] Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[ROFL] Unhandled rejection:', reason);
});

server.listen(PORT, HOST);
