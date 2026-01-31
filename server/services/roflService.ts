/**
 * ROFL Service - Backend Integration for Oasis ROFL Confidential Compute
 * 
 * This service handles communication with the ROFL enclave for:
 * - Submitting SIGNED MESSAGES (never wallet addresses) for confidential linking
 * - Receiving reputation scores with remote attestation
 * - Verifying attestations before trusting results
 * - Recording verified results to 0G Storage
 * 
 * SECURITY PRINCIPLES:
 * - Backend NEVER receives wallet addresses - only signed messages
 * - Backend NEVER computes reputation scores
 * - Backend NEVER stores wallet ↔ social mappings (mapping happens in enclave only)
 * - All trust derives from ROFL attestation verification
 * - Unverified results are rejected
 * 
 * CONFIDENTIALITY GUARANTEE:
 * - Wallet addresses are recovered from signatures INSIDE the ROFL enclave
 * - The backend cannot see or store wallet addresses
 * - Only attestation proofs and scores are stored
 * 
 * DEPLOYMENT MODES:
 * - Development: ROFL app runs locally (localhost:8080), simulated attestation
 * - Production: ROFL app runs on Oasis Sapphire (ROFL_ENDPOINT env var)
 *   Configure ROFL_TRUSTED_ENCLAVE_IDS and ROFL_TRUSTED_APP_HASHES for verification
 * 
 * @module roflService
 */

import crypto from 'crypto';
import { ogStorageService } from './ogStorageService';

/**
 * ROFL Input format (legacy - wallet address visible to backend)
 */
export interface RoflInput {
  daoai_user_id: string;
  wallet_address: string;
  social_profiles: SocialProfiles;
}

/**
 * ROFL Confidential Input format (wallet never visible to backend)
 */
export interface RoflConfidentialInput {
  daoai_user_id: string;
  signed_message: string;
  challenge: string;
  social_profiles: SocialProfiles;
}

/**
 * Social profile data structure
 */
export interface SocialProfiles {
  twitter?: {
    followers?: number;
    account_age_days?: number;
    tweets?: number;
    following?: number;
    handle?: string;
  };
  github?: {
    repos?: number;
    stars?: number;
    contributions?: number;
    account_age_days?: number;
    username?: string;
  };
  discord?: {
    servers?: number;
    account_age_days?: number;
    nitro?: boolean;
    handle?: string;
  };
  telegram?: {
    groups?: number;
    account_age_days?: number;
    premium?: boolean;
    handle?: string;
  };
  linkedin?: {
    connections?: number;
    account_age_days?: number;
    posts?: number;
    endorsements?: number;
    url?: string;
  };
}

/**
 * ROFL Attestation structure
 */
export interface RoflAttestation {
  version: string;
  type: string;
  enclave_id: string;
  app_hash: string;
  tee_type: string;
  input_hash?: string;
  output_hash: string;
  attestation_hash: string;
  signature: {
    algorithm: string;
    value: string;
    signer: string;
  };
  timestamp: string;
  nonce: string;
  verification: {
    method: string;
    endpoint: string;
    chain: string;
  };
}

/**
 * ROFL Output format
 */
export interface RoflOutput {
  daoai_user_id: string;
  reputation_score: number;
  confidence_score: number;
  score_breakdown?: {
    platforms: Record<string, { score: number; components: Record<string, number> }>;
    platform_count: number;
    base_score: number;
    cross_platform_bonus: number;
  };
  attestation: RoflAttestation;
  wallet_hash?: string;
  privacy_mode?: string;
}

/**
 * ROFL verification result
 */
export interface RoflVerificationResult {
  valid: boolean;
  enclave_id?: string;
  app_hash?: string;
  timestamp?: string;
  error?: string;
  verified_at?: string;
}

/**
 * Configuration for ROFL service
 */
interface RoflConfig {
  endpoint: string;
  timeout: number;
  maxRetries: number;
  trustedEnclaveIds: string[];
  trustedAppHashes: string[];
  maxAttestationAge: number; // in milliseconds
}

class RoflService {
  private config: RoflConfig;
  private isInitialized: boolean;

  constructor() {
    this.config = {
      // ROFL endpoint - in production, this would be the Oasis ROFL deployment
      endpoint: process.env.ROFL_ENDPOINT || 'http://localhost:8080',
      timeout: parseInt(process.env.ROFL_TIMEOUT || '30000'),
      maxRetries: parseInt(process.env.ROFL_MAX_RETRIES || '3'),
      // Trusted enclave identifiers (set in production)
      trustedEnclaveIds: (process.env.ROFL_TRUSTED_ENCLAVE_IDS || '').split(',').filter(Boolean),
      trustedAppHashes: (process.env.ROFL_TRUSTED_APP_HASHES || '').split(',').filter(Boolean),
      // Maximum age for attestations (default 1 hour)
      maxAttestationAge: parseInt(process.env.ROFL_MAX_ATTESTATION_AGE || '3600000')
    };

    this.isInitialized = true;
    console.log('[ROFL Service] Initialized');
    console.log(`[ROFL Service] Endpoint: ${this.config.endpoint}`);
  }

  /**
   * Check if ROFL service is available
   */
  isAvailable(): boolean {
    return this.isInitialized && !!this.config.endpoint;
  }

  /**
   * @deprecated REMOVED FOR CONFIDENTIALITY
   * 
   * This method has been permanently disabled because it accepts wallet addresses
   * directly, which violates the confidentiality requirement.
   * 
   * Use linkIdentityConfidentially() instead, which:
   * - Accepts only signed messages (not wallet addresses)
   * - Lets ROFL enclave recover the wallet from the signature
   * - Never exposes wallet addresses to the backend
   * 
   * @throws Error Always throws - this method is disabled
   */
  async computeReputation(
    _userId: string,
    _walletAddress: string,
    _socialProfiles: SocialProfiles
  ): Promise<RoflOutput> {
    throw new Error(
      'computeReputation() is DISABLED for confidentiality. ' +
      'Use linkIdentityConfidentially() instead - wallet addresses must never touch the backend.'
    );
  }

  /**
   * CONFIDENTIAL: Link identity using signed message
   * 
   * This is the privacy-preserving method where:
   * - Backend receives signed message (NOT the wallet address)
   * - Backend forwards to ROFL without seeing wallet
   * - ROFL verifies signature and recovers wallet inside enclave
   * - ROFL returns score + attestation (NO wallet exposed)
   * 
   * @param userId - DAO AI user ID
   * @param signedMessage - Signature from user's wallet
   * @param challenge - The challenge message that was signed
   * @param socialProfiles - User's social profile data
   * @returns ROFL output with reputation score and attestation
   */
  async linkIdentityConfidentially(
    userId: string,
    signedMessage: string,
    challenge: string,
    socialProfiles: SocialProfiles
  ): Promise<RoflOutput> {
    if (!this.isAvailable()) {
      throw new Error('ROFL service not available');
    }

    // Validate signature format (65 bytes = 132 hex chars with 0x)
    if (!signedMessage.startsWith('0x') || signedMessage.length !== 132) {
      throw new Error('Invalid signature format');
    }

    // Validate we have at least one social profile
    if (Object.keys(socialProfiles).length === 0) {
      throw new Error('At least one social profile is required');
    }

    const input: RoflConfidentialInput = {
      daoai_user_id: userId,
      signed_message: signedMessage,
      challenge: challenge,
      social_profiles: this.sanitizeSocialProfiles(socialProfiles)
    };

    // Try to call ROFL confidential endpoint with retries
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const result = await this.callRoflConfidentialEndpoint(input);
        
        // Verify attestation before trusting the result
        const verification = await this.verifyAttestation(result.attestation);
        if (!verification.valid) {
          throw new Error(`Attestation verification failed: ${verification.error}`);
        }

        console.log(`[ROFL Service] Confidential identity linked for user ${userId}: score=${result.reputation_score}`);
        return result;

      } catch (error) {
        lastError = error as Error;
        console.error(`[ROFL Service] Confidential link attempt ${attempt} failed:`, error);
        
        if (attempt < this.config.maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    // NO FALLBACK - Production TEE required
    throw new Error(`ROFL enclave unavailable after ${this.config.maxRetries} attempts. Last error: ${lastError?.message || 'unknown'}. Endpoint: ${this.config.endpoint}`);
  }

  /**
   * Local fallback computation when ROFL enclave is unavailable
   * This provides the same functionality but without TEE guarantees
   */
  private async computeLocalFallback(
    userId: string,
    signedMessage: string,
    challenge: string,
    socialProfiles: SocialProfiles
  ): Promise<RoflOutput> {
    const { ethers } = await import('ethers');
    
    // Verify signature and recover wallet address locally
    let walletAddress: string;
    try {
      walletAddress = ethers.verifyMessage(challenge, signedMessage);
    } catch (error) {
      throw new Error(`Signature verification failed: ${(error as Error).message}`);
    }

    // Compute reputation score locally
    const reputation = this.computeReputationLocally(socialProfiles);

    // Generate wallet hash (privacy preserving)
    const walletHash = crypto.createHash('sha256')
      .update(walletAddress.toLowerCase())
      .digest('hex');

    // Generate local attestation (marked as fallback)
    const timestamp = new Date().toISOString();
    const nonce = crypto.randomBytes(16).toString('hex');
    const enclaveId = 'local-fallback';
    
    const outputHash = crypto.createHash('sha256')
      .update(JSON.stringify({ userId, reputation, timestamp }))
      .digest('hex');

    const attestation: RoflAttestation = {
      version: '1.0',
      type: 'LOCAL_FALLBACK',
      enclave_id: enclaveId,
      app_hash: 'daoai-local-fallback',
      tee_type: 'NONE',
      output_hash: outputHash,
      attestation_hash: crypto.createHash('sha256').update(`${enclaveId}:${outputHash}:${nonce}`).digest('hex'),
      signature: {
        algorithm: 'HMAC-SHA256',
        value: crypto.createHmac('sha256', 'local-fallback-key').update(outputHash).digest('hex'),
        signer: enclaveId
      },
      timestamp,
      nonce
    };

    console.log(`[ROFL Service] Local fallback computed for user ${userId}: score=${reputation.reputation_score}`);

    return {
      daoai_user_id: userId,
      reputation_score: reputation.reputation_score,
      confidence_score: reputation.confidence_score,
      score_breakdown: reputation.breakdown,
      wallet_hash: walletHash,
      privacy_mode: 'local_fallback',
      attestation
    };
  }

  /**
   * Compute reputation score locally (mirrors ROFL enclave logic)
   */
  private computeReputationLocally(socialProfiles: SocialProfiles): {
    reputation_score: number;
    confidence_score: number;
    breakdown: Record<string, number>;
  } {
    let totalScore = 0;
    let platformCount = 0;
    const breakdown: Record<string, number> = {};

    if (socialProfiles.twitter) {
      const t = socialProfiles.twitter;
      const score = Math.min(100,
        (t.followers || 0) * 0.01 +
        (t.account_age_days || 0) * 0.05 +
        (t.tweets || 0) * 0.005
      );
      breakdown.twitter = Math.round(score);
      totalScore += score;
      platformCount++;
    }

    if (socialProfiles.github) {
      const g = socialProfiles.github;
      const score = Math.min(100,
        (g.repos || 0) * 2 +
        (g.stars || 0) * 0.5 +
        (g.contributions || 0) * 0.1 +
        (g.account_age_days || 0) * 0.03
      );
      breakdown.github = Math.round(score);
      totalScore += score;
      platformCount++;
    }

    if (socialProfiles.discord) {
      const d = socialProfiles.discord;
      const score = Math.min(100,
        (d.servers || 0) * 2 +
        (d.account_age_days || 0) * 0.05 +
        (d.nitro ? 10 : 0)
      );
      breakdown.discord = Math.round(score);
      totalScore += score;
      platformCount++;
    }

    const avgScore = platformCount > 0 ? totalScore / platformCount : 0;
    const crossPlatformBonus = Math.min(20, platformCount * 5);
    const finalScore = Math.min(100, avgScore + crossPlatformBonus);
    const confidence = Math.min(100, platformCount * 25);

    return {
      reputation_score: Math.round(finalScore),
      confidence_score: Math.round(confidence),
      breakdown
    };
  }

  /**
   * Call the ROFL confidential link endpoint
   */
  private async callRoflConfidentialEndpoint(input: RoflConfidentialInput): Promise<RoflOutput> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.endpoint}/link-identity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          daoai_user_id: input.daoai_user_id,
          signed_message: input.signed_message,
          challenge: input.challenge,
          social_profiles: input.social_profiles
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`ROFL confidential endpoint returned ${response.status}: ${errorBody}`);
      }

      const result: RoflOutput = await response.json();
      return result;

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Call the ROFL endpoint to compute reputation
   */
  private async callRoflEndpoint(input: RoflInput): Promise<RoflOutput> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.endpoint}/compute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`ROFL endpoint returned ${response.status}: ${errorBody}`);
      }

      const result: RoflOutput = await response.json();
      return result;

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Verify a ROFL remote attestation
   * 
   * @param attestation - The attestation to verify
   * @returns Verification result
   */
  async verifyAttestation(attestation: RoflAttestation): Promise<RoflVerificationResult> {
    try {
      // 1. Check required fields
      const requiredFields = ['enclave_id', 'app_hash', 'attestation_hash', 'signature', 'timestamp'];
      for (const field of requiredFields) {
        if (!(attestation as any)[field]) {
          return {
            valid: false,
            error: `Missing required field: ${field}`
          };
        }
      }

      // 2. Check attestation age
      const attestationTime = new Date(attestation.timestamp);
      const now = new Date();
      const ageMs = now.getTime() - attestationTime.getTime();

      if (ageMs > this.config.maxAttestationAge) {
        return {
          valid: false,
          error: `Attestation expired (age: ${Math.round(ageMs / 1000)}s, max: ${Math.round(this.config.maxAttestationAge / 1000)}s)`
        };
      }

      // 3. Verify enclave identity if trusted list is configured
      if (this.config.trustedEnclaveIds.length > 0) {
        if (!this.config.trustedEnclaveIds.includes(attestation.enclave_id)) {
          return {
            valid: false,
            error: 'Untrusted enclave ID'
          };
        }
      }

      // 4. Verify app hash if trusted list is configured
      if (this.config.trustedAppHashes.length > 0) {
        if (!this.config.trustedAppHashes.includes(attestation.app_hash)) {
          return {
            valid: false,
            error: 'Untrusted app hash'
          };
        }
      }

      // 5. Verify signature
      const signingKey = crypto.createHash('sha256')
        .update(attestation.enclave_id + attestation.app_hash)
        .digest('hex');

      const expectedSignature = crypto.createHmac('sha256', signingKey)
        .update(attestation.attestation_hash)
        .digest('hex');

      if (attestation.signature.value !== expectedSignature) {
        return {
          valid: false,
          error: 'Invalid signature'
        };
      }

      // 6. All checks passed
      return {
        valid: true,
        enclave_id: attestation.enclave_id,
        app_hash: attestation.app_hash,
        timestamp: attestation.timestamp,
        verified_at: new Date().toISOString()
      };

    } catch (error) {
      return {
        valid: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * Record ROFL computation result to 0G Storage
   * 
   * @param userId - User ID
   * @param result - ROFL computation result
   * @returns 0G Storage transaction result
   */
  async recordToOgStorage(
    userId: string,
    result: RoflOutput
  ): Promise<{ success: boolean; txHash?: string; rootHash?: string }> {
    try {
      if (!ogStorageService.isAvailable()) {
        console.log('[ROFL Service] 0G Storage not available, skipping recording');
        return { success: false };
      }

      // Create audit record for 0G Storage
      const auditRecord = {
        action_type: 'ROFL_REPUTATION' as const,
        user_id: userId,
        reputation_score: result.reputation_score,
        confidence_score: result.confidence_score,
        attestation_hash: result.attestation.attestation_hash,
        enclave_id: result.attestation.enclave_id,
        app_hash: result.attestation.app_hash,
        computed_at: result.attestation.timestamp,
        recorded_at: new Date().toISOString()
      };

      // Use ogStorageService to upload the record
      const ogResult = await ogStorageService.uploadAuditRecord({
        action_id: Date.now().toString(),
        action_type: 'STAKE', // Using STAKE as closest action type
        actor_user_id: userId,
        target_id: userId,
        target_type: 'USER',
        content: JSON.stringify({
          type: 'ROFL_REPUTATION',
          score: result.reputation_score,
          confidence: result.confidence_score
        }),
        metadata: auditRecord,
        timestamp: new Date().toISOString(),
        app: 'DAO-AI-ROFL',
        environment: process.env.NODE_ENV || 'development'
      });

      if (ogResult.success) {
        console.log(`[ROFL Service] Recorded to 0G Storage: tx=${ogResult.txHash}`);
      }

      return {
        success: ogResult.success,
        txHash: ogResult.txHash || undefined,
        rootHash: ogResult.rootHash || undefined
      };

    } catch (error) {
      console.error('[ROFL Service] Failed to record to 0G Storage:', error);
      return { success: false };
    }
  }

  /**
   * Get ROFL health status
   */
  async getHealth(): Promise<{ healthy: boolean; endpoint: string; error?: string }> {
    try {
      const response = await fetch(`${this.config.endpoint}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          healthy: true,
          endpoint: this.config.endpoint,
          ...data
        };
      }

      return {
        healthy: false,
        endpoint: this.config.endpoint,
        error: `HTTP ${response.status}`
      };
    } catch (error) {
      return {
        healthy: false,
        endpoint: this.config.endpoint,
        error: (error as Error).message
      };
    }
  }

  /**
   * Get ROFL enclave information
   */
  async getEnclaveInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.config.endpoint}/info`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        return await response.json();
      }

      return null;
    } catch (error) {
      console.error('[ROFL Service] Failed to get enclave info:', error);
      return null;
    }
  }

  /**
   * Validate Ethereum wallet address format
   */
  private isValidWalletAddress(address: string): boolean {
    if (typeof address !== 'string') return false;
    if (!address.startsWith('0x')) return false;
    if (address.length !== 42) return false;
    
    const hexPart = address.slice(2);
    return /^[0-9a-fA-F]+$/.test(hexPart);
  }

  /**
   * Sanitize social profiles to remove any sensitive data
   * Only numeric/boolean metrics are kept
   */
  private sanitizeSocialProfiles(profiles: SocialProfiles): SocialProfiles {
    const sanitized: SocialProfiles = {};

    if (profiles.twitter) {
      sanitized.twitter = {
        followers: profiles.twitter.followers || 0,
        account_age_days: profiles.twitter.account_age_days || 0,
        tweets: profiles.twitter.tweets || 0,
        following: profiles.twitter.following || 0
      };
    }

    if (profiles.github) {
      sanitized.github = {
        repos: profiles.github.repos || 0,
        stars: profiles.github.stars || 0,
        contributions: profiles.github.contributions || 0,
        account_age_days: profiles.github.account_age_days || 0
      };
    }

    if (profiles.discord) {
      sanitized.discord = {
        servers: profiles.discord.servers || 0,
        account_age_days: profiles.discord.account_age_days || 0,
        nitro: profiles.discord.nitro || false
      };
    }

    if (profiles.telegram) {
      sanitized.telegram = {
        groups: profiles.telegram.groups || 0,
        account_age_days: profiles.telegram.account_age_days || 0,
        premium: profiles.telegram.premium || false
      };
    }

    if (profiles.linkedin) {
      sanitized.linkedin = {
        connections: profiles.linkedin.connections || 0,
        account_age_days: profiles.linkedin.account_age_days || 0,
        posts: profiles.linkedin.posts || 0,
        endorsements: profiles.linkedin.endorsements || 0
      };
    }

    return sanitized;
  }

  /**
   * Delay utility for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const roflService = new RoflService();

export { RoflService };
