/**
 * Oasis ROFL Confidential Compute Application
 * 
 * This application runs inside a ROFL TEE (Trusted Execution Environment) enclave.
 * It confidentially links wallet addresses with social profiles and computes
 * deterministic reputation scores with remote attestation.
 * 
 * SECURITY GUARANTEES:
 * - All computation happens inside the enclave
 * - Wallet ↔ social mappings are never exposed outside the enclave
 * - Only reputation scores and attestations are returned
 * - Application is stateless - no persistent storage
 * 
 * @module daoai-rofl-app
 */

import http from 'http';
import { computeReputation } from './reputation.js';
import { generateAttestation, getEnclaveIdentity } from './attestation.js';
import { validateInput, sanitizeOutput } from './validation.js';
import { verifySignatureAndRecoverWallet, validateSignedInput, hashWalletForAudit } from './walletVerification.js';

const PORT = process.env.PORT || 8080;
const ROFL_MODE = process.env.ROFL_MODE || 'development';

/**
 * Process a reputation computation request
 * 
 * @param {Object} input - The input data containing user ID, wallet, and social profiles
 * @returns {Object} The reputation result with attestation
 */
async function processReputationRequest(input) {
  const startTime = Date.now();
  
  // Validate input format
  const validationResult = validateInput(input);
  if (!validationResult.valid) {
    throw new Error(`Invalid input: ${validationResult.error}`);
  }

  const { daoai_user_id, wallet_address, social_profiles } = input;

  // CONFIDENTIAL OPERATION: Link wallet with social profiles
  // This linking happens ONLY inside the enclave and is never exposed
  const confidentialLink = createConfidentialLink(daoai_user_id, wallet_address, social_profiles);

  // Compute deterministic reputation score
  const reputationResult = computeReputation(social_profiles);

  // Generate ROFL remote attestation
  const attestation = await generateAttestation({
    daoai_user_id,
    wallet_address_hash: hashWalletAddress(wallet_address),
    reputation_score: reputationResult.reputation_score,
    confidence_score: reputationResult.confidence_score,
    computation_time_ms: Date.now() - startTime,
    enclave_identity: getEnclaveIdentity()
  });

  // Sanitize output - ensure no sensitive data leaks
  const output = sanitizeOutput({
    daoai_user_id,
    reputation_score: reputationResult.reputation_score,
    confidence_score: reputationResult.confidence_score,
    score_breakdown: reputationResult.breakdown,
    attestation
  });

  return output;
}

/**
 * Process a CONFIDENTIAL identity link request
 * 
 * This is the privacy-preserving endpoint where:
 * 1. Backend sends signed message (NOT the wallet address)
 * 2. ROFL verifies signature and recovers wallet address
 * 3. ROFL links wallet ↔ identity privately
 * 4. ROFL returns score + attestation (NO wallet exposed)
 * 
 * @param {Object} input - Contains signed_message, challenge, user_id, social_profiles
 * @returns {Object} The reputation result with attestation (no wallet address)
 */
async function processConfidentialLinkRequest(input) {
  const startTime = Date.now();
  
  // Validate input format for signed message flow
  const validationResult = validateSignedInput(input);
  if (!validationResult.valid) {
    throw new Error(`Invalid input: ${validationResult.error}`);
  }

  const { signed_message, challenge, daoai_user_id, social_profiles } = input;

  // CORE PRIVACY OPERATION: Recover wallet from signature
  // This is the key step - the backend NEVER sees the wallet address
  // Only the ROFL enclave can recover it from the signature
  const verificationResult = await verifySignatureAndRecoverWallet(signed_message, challenge);
  
  if (!verificationResult.valid) {
    throw new Error(`Signature verification failed: ${verificationResult.error}`);
  }

  const walletAddress = verificationResult.walletAddress;

  // CONFIDENTIAL OPERATION: Link wallet with social profiles
  // This linking happens ONLY inside the enclave and is never exposed
  const confidentialLink = await createConfidentialLink(daoai_user_id, walletAddress, social_profiles);

  // Compute deterministic reputation score
  const reputationResult = computeReputation(social_profiles);

  // Create wallet hash for attestation (privacy-preserving)
  const walletHash = await hashWalletForAudit(walletAddress);

  // Generate ROFL remote attestation
  const attestation = await generateAttestation({
    daoai_user_id,
    wallet_address_hash: walletHash,
    reputation_score: reputationResult.reputation_score,
    confidence_score: reputationResult.confidence_score,
    computation_time_ms: Date.now() - startTime,
    enclave_identity: getEnclaveIdentity(),
    privacy_mode: 'confidential' // Indicates wallet was recovered from signature
  });

  // Sanitize output - CRITICAL: ensure NO wallet address leaks
  const output = sanitizeOutput({
    daoai_user_id,
    reputation_score: reputationResult.reputation_score,
    confidence_score: reputationResult.confidence_score,
    score_breakdown: reputationResult.breakdown,
    attestation,
    // Include wallet hash (not address) for verification
    wallet_hash: walletHash,
    privacy_mode: 'confidential'
  });

  return output;
}

/**
 * Create a confidential link between wallet and social profiles
 * This operation happens ONLY inside the enclave
 * 
 * @param {string} userId - DAO AI user ID
 * @param {string} walletAddress - User's wallet address
 * @param {Object} socialProfiles - User's social profile data
 * @returns {Object} Confidential link metadata (hash only)
 */
async function createConfidentialLink(userId, walletAddress, socialProfiles) {
  const crypto = await import('crypto');
  
  // Create a deterministic hash of the link
  // This proves the link was created without exposing the actual mapping
  const linkData = JSON.stringify({
    userId,
    walletAddress: walletAddress.toLowerCase(),
    socialProfileKeys: Object.keys(socialProfiles).sort()
  });

  const linkHash = crypto.createHash('sha256')
    .update(linkData)
    .digest('hex');

  // Return only the hash - the actual mapping stays in enclave memory
  // and is discarded after computation
  return {
    link_hash: linkHash,
    created_at: new Date().toISOString(),
    enclave_verified: true
  };
}

/**
 * Hash wallet address for attestation (privacy-preserving)
 * 
 * @param {string} walletAddress - The wallet address to hash
 * @returns {string} SHA-256 hash of the lowercase wallet address
 */
async function hashWalletAddress(walletAddress) {
  const crypto = await import('crypto');
  return crypto.createHash('sha256')
    .update(walletAddress.toLowerCase())
    .digest('hex');
}

/**
 * HTTP request handler
 */
async function handleRequest(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      mode: ROFL_MODE,
      timestamp: new Date().toISOString(),
      enclave: getEnclaveIdentity()
    }));
    return;
  }

  // Enclave info endpoint
  if (req.method === 'GET' && req.url === '/info') {
    res.writeHead(200);
    res.end(JSON.stringify({
      app: 'daoai-reputation-rofl',
      version: '1.0.0',
      mode: ROFL_MODE,
      enclave: getEnclaveIdentity(),
      capabilities: [
        'wallet_social_linking',
        'reputation_scoring',
        'remote_attestation'
      ]
    }));
    return;
  }

  // CONFIDENTIAL identity linking endpoint (preferred - wallet never exposed to backend)
  if (req.method === 'POST' && req.url === '/link-identity') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1048576) {
        res.writeHead(413);
        res.end(JSON.stringify({ error: 'Request too large' }));
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        const input = JSON.parse(body);
        const result = await processConfidentialLinkRequest(input);
        
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('[ROFL] Confidential link error:', error.message);
        
        res.writeHead(400);
        res.end(JSON.stringify({
          error: error.message,
          timestamp: new Date().toISOString()
        }));
      }
    });
    return;
  }

  // Legacy reputation computation endpoint (requires wallet_address - less private)
  if (req.method === 'POST' && req.url === '/compute') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
      // Limit request size
      if (body.length > 1048576) {
        res.writeHead(413);
        res.end(JSON.stringify({ error: 'Request too large' }));
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        const input = JSON.parse(body);
        const result = await processReputationRequest(input);
        
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('[ROFL] Computation error:', error.message);
        
        res.writeHead(400);
        res.end(JSON.stringify({
          error: error.message,
          timestamp: new Date().toISOString()
        }));
      }
    });
    return;
  }

  // 404 for unknown routes
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
}

// Create and start HTTP server
const server = http.createServer(handleRequest);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[ROFL] Confidential compute app started`);
  console.log(`[ROFL] Mode: ${ROFL_MODE}`);
  console.log(`[ROFL] Port: ${PORT}`);
  console.log(`[ROFL] Enclave: ${getEnclaveIdentity().enclave_id}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[ROFL] Shutting down gracefully...');
  server.close(() => {
    console.log('[ROFL] Server closed');
    process.exit(0);
  });
});

export { processReputationRequest, createConfidentialLink, hashWalletAddress };
