/**
 * Wallet Signature Verification Module
 * 
 * This module verifies wallet ownership through signed messages,
 * allowing the enclave to recover the wallet address from a signature
 * without the backend ever seeing the actual wallet address.
 * 
 * SECURITY GUARANTEES:
 * - Wallet address is derived inside the enclave from the signature
 * - Backend never receives or processes the wallet address
 * - Only the enclave can link wallet ↔ identity
 * 
 * @module walletVerification
 */

/**
 * Verify a signed message and recover the wallet address
 * 
 * This is the core privacy-preserving operation:
 * - Client signs a message with their wallet (client-side)
 * - Backend forwards the signature to ROFL (never sees wallet)
 * - ROFL recovers the wallet address from the signature
 * 
 * @param {string} signedMessage - The signature from the wallet
 * @param {string} challenge - The original challenge message that was signed
 * @returns {Object} Verification result with recovered wallet address
 */
export async function verifySignatureAndRecoverWallet(signedMessage, challenge) {
  try {
    // Import ethers for signature verification
    const { ethers } = await import('ethers');
    
    // Recover the wallet address from the signed message
    // This is the key privacy operation - the wallet address is derived
    // inside the enclave from the cryptographic signature
    const recoveredAddress = ethers.verifyMessage(challenge, signedMessage);
    
    // Validate the recovered address
    if (!recoveredAddress || !ethers.isAddress(recoveredAddress)) {
      return {
        valid: false,
        error: 'Failed to recover valid wallet address from signature'
      };
    }

    // Validate the challenge format
    if (!isValidChallenge(challenge)) {
      return {
        valid: false,
        error: 'Invalid challenge format'
      };
    }

    // Extract timestamp from challenge and validate it's recent
    const timestampMatch = challenge.match(/Timestamp:\s*(\d+)/);
    if (timestampMatch) {
      const timestamp = parseInt(timestampMatch[1], 10);
      const now = Date.now();
      const maxAge = 5 * 60 * 1000; // 5 minutes
      
      if (now - timestamp > maxAge) {
        return {
          valid: false,
          error: 'Challenge has expired'
        };
      }
    }

    return {
      valid: true,
      walletAddress: recoveredAddress.toLowerCase(),
      checksumAddress: recoveredAddress
    };

  } catch (error) {
    console.error('[ROFL] Signature verification error:', error.message);
    return {
      valid: false,
      error: 'Invalid signature'
    };
  }
}

/**
 * Validate challenge message format
 */
function isValidChallenge(challenge) {
  if (typeof challenge !== 'string') return false;
  if (challenge.length < 20 || challenge.length > 500) return false;
  
  // Must contain expected prefix
  if (!challenge.includes('DAOAI')) return false;
  
  // Must contain a timestamp
  if (!challenge.includes('Timestamp:')) return false;
  
  return true;
}

/**
 * Validate signed message input format
 */
export function validateSignedInput(input) {
  if (!input || typeof input !== 'object') {
    return {
      valid: false,
      error: 'Input must be a valid object'
    };
  }

  // Validate signed_message
  if (!input.signed_message || typeof input.signed_message !== 'string') {
    return {
      valid: false,
      error: 'signed_message is required and must be a string'
    };
  }

  // Validate signature format (should be 65 bytes = 132 hex chars with 0x prefix)
  if (!input.signed_message.startsWith('0x') || input.signed_message.length !== 132) {
    return {
      valid: false,
      error: 'Invalid signature format'
    };
  }

  // Validate challenge
  if (!input.challenge || typeof input.challenge !== 'string') {
    return {
      valid: false,
      error: 'challenge is required and must be a string'
    };
  }

  // Validate daoai_user_id
  if (!input.daoai_user_id || typeof input.daoai_user_id !== 'string') {
    return {
      valid: false,
      error: 'daoai_user_id is required and must be a string'
    };
  }

  // Validate social_profiles
  if (!input.social_profiles || typeof input.social_profiles !== 'object') {
    return {
      valid: false,
      error: 'social_profiles is required and must be an object'
    };
  }

  const profileKeys = Object.keys(input.social_profiles);
  if (profileKeys.length === 0) {
    return {
      valid: false,
      error: 'At least one social profile is required'
    };
  }

  // Validate platforms
  const validPlatforms = ['twitter', 'github', 'discord', 'telegram', 'linkedin'];
  for (const platform of profileKeys) {
    if (!validPlatforms.includes(platform)) {
      return {
        valid: false,
        error: `Unknown platform: ${platform}`
      };
    }
  }

  return { valid: true };
}

/**
 * Create a hash of the wallet address for logging/auditing
 * without revealing the actual address
 */
export async function hashWalletForAudit(walletAddress) {
  const crypto = await import('crypto');
  return crypto.createHash('sha256')
    .update(walletAddress.toLowerCase())
    .digest('hex');
}
