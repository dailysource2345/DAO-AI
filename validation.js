/**
 * Input Validation and Output Sanitization Module
 * 
 * This module ensures all data entering and leaving the ROFL enclave
 * is properly validated and sanitized to prevent data leakage.
 * 
 * SECURITY RULES:
 * - Validate all inputs before processing
 * - Never expose wallet addresses in outputs
 * - Sanitize all outputs before returning
 * - No sensitive data in error messages
 * 
 * @module validation
 */

/**
 * Validate input data for reputation computation
 * 
 * @param {Object} input - The input data to validate
 * @returns {Object} Validation result with valid flag and error message
 */
export function validateInput(input) {
  // Check if input is an object
  if (!input || typeof input !== 'object') {
    return {
      valid: false,
      error: 'Input must be a valid object'
    };
  }

  // Validate daoai_user_id
  if (!input.daoai_user_id || typeof input.daoai_user_id !== 'string') {
    return {
      valid: false,
      error: 'daoai_user_id is required and must be a string'
    };
  }

  if (input.daoai_user_id.length > 100) {
    return {
      valid: false,
      error: 'daoai_user_id must not exceed 100 characters'
    };
  }

  // Validate wallet_address
  if (!input.wallet_address || typeof input.wallet_address !== 'string') {
    return {
      valid: false,
      error: 'wallet_address is required and must be a string'
    };
  }

  // Basic Ethereum address validation
  if (!isValidWalletAddress(input.wallet_address)) {
    return {
      valid: false,
      error: 'wallet_address must be a valid Ethereum address'
    };
  }

  // Validate social_profiles
  if (!input.social_profiles || typeof input.social_profiles !== 'object') {
    return {
      valid: false,
      error: 'social_profiles is required and must be an object'
    };
  }

  // Validate at least one social profile exists
  const profileKeys = Object.keys(input.social_profiles);
  if (profileKeys.length === 0) {
    return {
      valid: false,
      error: 'At least one social profile is required'
    };
  }

  // Validate each social profile
  const validPlatforms = ['twitter', 'github', 'discord', 'telegram', 'linkedin'];
  for (const platform of profileKeys) {
    if (!validPlatforms.includes(platform)) {
      return {
        valid: false,
        error: `Unknown platform: ${platform}. Valid platforms: ${validPlatforms.join(', ')}`
      };
    }

    const profileValidation = validateSocialProfile(platform, input.social_profiles[platform]);
    if (!profileValidation.valid) {
      return profileValidation;
    }
  }

  return { valid: true };
}

/**
 * Validate Ethereum wallet address format
 */
function isValidWalletAddress(address) {
  if (typeof address !== 'string') return false;
  
  // Must start with 0x
  if (!address.startsWith('0x')) return false;
  
  // Must be 42 characters (0x + 40 hex characters)
  if (address.length !== 42) return false;
  
  // Must be valid hex
  const hexPart = address.slice(2);
  if (!/^[0-9a-fA-F]+$/.test(hexPart)) return false;
  
  return true;
}

/**
 * Validate social profile data
 */
function validateSocialProfile(platform, profile) {
  if (!profile || typeof profile !== 'object') {
    return {
      valid: false,
      error: `${platform} profile must be an object`
    };
  }

  // Platform-specific validation
  switch (platform) {
    case 'twitter':
      return validateTwitterProfile(profile);
    case 'github':
      return validateGitHubProfile(profile);
    case 'discord':
      return validateDiscordProfile(profile);
    case 'telegram':
      return validateTelegramProfile(profile);
    case 'linkedin':
      return validateLinkedInProfile(profile);
    default:
      return { valid: true };
  }
}

function validateTwitterProfile(profile) {
  // followers must be a non-negative integer if present
  if (profile.followers !== undefined) {
    if (typeof profile.followers !== 'number' || profile.followers < 0 || !Number.isInteger(profile.followers)) {
      return {
        valid: false,
        error: 'twitter.followers must be a non-negative integer'
      };
    }
  }

  // account_age_days must be a non-negative integer if present
  if (profile.account_age_days !== undefined) {
    if (typeof profile.account_age_days !== 'number' || profile.account_age_days < 0) {
      return {
        valid: false,
        error: 'twitter.account_age_days must be a non-negative number'
      };
    }
  }

  return { valid: true };
}

function validateGitHubProfile(profile) {
  if (profile.repos !== undefined) {
    if (typeof profile.repos !== 'number' || profile.repos < 0 || !Number.isInteger(profile.repos)) {
      return {
        valid: false,
        error: 'github.repos must be a non-negative integer'
      };
    }
  }

  if (profile.stars !== undefined) {
    if (typeof profile.stars !== 'number' || profile.stars < 0 || !Number.isInteger(profile.stars)) {
      return {
        valid: false,
        error: 'github.stars must be a non-negative integer'
      };
    }
  }

  return { valid: true };
}

function validateDiscordProfile(profile) {
  if (profile.servers !== undefined) {
    if (typeof profile.servers !== 'number' || profile.servers < 0 || !Number.isInteger(profile.servers)) {
      return {
        valid: false,
        error: 'discord.servers must be a non-negative integer'
      };
    }
  }

  return { valid: true };
}

function validateTelegramProfile(profile) {
  if (profile.groups !== undefined) {
    if (typeof profile.groups !== 'number' || profile.groups < 0 || !Number.isInteger(profile.groups)) {
      return {
        valid: false,
        error: 'telegram.groups must be a non-negative integer'
      };
    }
  }

  return { valid: true };
}

function validateLinkedInProfile(profile) {
  if (profile.connections !== undefined) {
    if (typeof profile.connections !== 'number' || profile.connections < 0 || !Number.isInteger(profile.connections)) {
      return {
        valid: false,
        error: 'linkedin.connections must be a non-negative integer'
      };
    }
  }

  return { valid: true };
}

/**
 * Sanitize output to ensure no sensitive data leaks
 * 
 * @param {Object} output - The output data to sanitize
 * @returns {Object} Sanitized output safe for external consumption
 */
export function sanitizeOutput(output) {
  // Create a clean copy with only allowed fields
  const sanitized = {
    daoai_user_id: output.daoai_user_id,
    reputation_score: output.reputation_score,
    confidence_score: output.confidence_score
  };

  // Include wallet hash if present (privacy-preserving identifier)
  if (output.wallet_hash) {
    sanitized.wallet_hash = output.wallet_hash;
  }

  // Include privacy mode indicator
  if (output.privacy_mode) {
    sanitized.privacy_mode = output.privacy_mode;
  }

  // Include score breakdown if present (no sensitive data)
  if (output.score_breakdown) {
    sanitized.score_breakdown = sanitizeBreakdown(output.score_breakdown);
  }

  // Include attestation if present
  if (output.attestation) {
    sanitized.attestation = sanitizeAttestation(output.attestation);
  }

  return sanitized;
}

/**
 * Sanitize score breakdown
 */
function sanitizeBreakdown(breakdown) {
  return {
    platforms: breakdown.platforms ? Object.fromEntries(
      Object.entries(breakdown.platforms).map(([platform, data]) => [
        platform,
        {
          score: data.score,
          components: data.components
        }
      ])
    ) : {},
    platform_count: breakdown.platform_count,
    base_score: breakdown.base_score,
    cross_platform_bonus: breakdown.cross_platform_bonus
  };
}

/**
 * Sanitize attestation to remove any potentially sensitive data
 */
function sanitizeAttestation(attestation) {
  // Only include necessary attestation fields
  return {
    version: attestation.version,
    type: attestation.type,
    enclave_id: attestation.enclave_id,
    app_hash: attestation.app_hash,
    tee_type: attestation.tee_type,
    output_hash: attestation.output_hash,
    attestation_hash: attestation.attestation_hash,
    signature: attestation.signature,
    timestamp: attestation.timestamp,
    nonce: attestation.nonce,
    verification: attestation.verification
  };
}

/**
 * Sanitize error messages to prevent information leakage
 */
export function sanitizeError(error) {
  // Never expose stack traces or internal details
  const safeErrors = [
    'Invalid input',
    'Missing required field',
    'Invalid wallet address',
    'Processing error',
    'Attestation failed'
  ];

  for (const safeError of safeErrors) {
    if (error.includes(safeError)) {
      return error;
    }
  }

  // Return generic error for unknown errors
  return 'An error occurred during processing';
}
