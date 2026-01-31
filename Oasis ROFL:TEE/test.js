/**
 * ROFL App Test Suite
 * 
 * Tests for the reputation computation and attestation generation.
 * Run with: npm test (or node src/test.js)
 * 
 * @module test
 */

import { computeReputation, WEIGHTS, THRESHOLDS } from './reputation.js';
import { generateAttestation, verifyAttestation, getEnclaveIdentity } from './attestation.js';
import { validateInput, sanitizeOutput } from './validation.js';

console.log('=== ROFL App Test Suite ===\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  Error: ${error.message}`);
    testsFailed++;
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message} Expected ${expected}, got ${actual}`);
  }
}

function assertRange(value, min, max, message = '') {
  if (value < min || value > max) {
    throw new Error(`${message} Expected value between ${min} and ${max}, got ${value}`);
  }
}

function assertTrue(condition, message = '') {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// ============= Input Validation Tests =============

console.log('--- Input Validation Tests ---');

test('validates correct input', () => {
  const input = {
    daoai_user_id: 'u_12345',
    wallet_address: '0x1234567890123456789012345678901234567890',
    social_profiles: {
      twitter: { followers: 1000, account_age_days: 365 }
    }
  };
  const result = validateInput(input);
  assertTrue(result.valid, 'Input should be valid');
});

test('rejects missing daoai_user_id', () => {
  const input = {
    wallet_address: '0x1234567890123456789012345678901234567890',
    social_profiles: { twitter: { followers: 100 } }
  };
  const result = validateInput(input);
  assertTrue(!result.valid, 'Should reject missing user ID');
});

test('rejects invalid wallet address', () => {
  const input = {
    daoai_user_id: 'u_12345',
    wallet_address: 'invalid-address',
    social_profiles: { twitter: { followers: 100 } }
  };
  const result = validateInput(input);
  assertTrue(!result.valid, 'Should reject invalid wallet');
});

test('rejects empty social profiles', () => {
  const input = {
    daoai_user_id: 'u_12345',
    wallet_address: '0x1234567890123456789012345678901234567890',
    social_profiles: {}
  };
  const result = validateInput(input);
  assertTrue(!result.valid, 'Should reject empty social profiles');
});

test('rejects unknown platform', () => {
  const input = {
    daoai_user_id: 'u_12345',
    wallet_address: '0x1234567890123456789012345678901234567890',
    social_profiles: {
      facebook: { friends: 500 }
    }
  };
  const result = validateInput(input);
  assertTrue(!result.valid, 'Should reject unknown platform');
});

// ============= Reputation Scoring Tests =============

console.log('\n--- Reputation Scoring Tests ---');

test('computes score for Twitter-only profile', () => {
  const socialProfiles = {
    twitter: {
      followers: 5000,
      account_age_days: 730,
      tweets: 500,
      following: 200
    }
  };
  const result = computeReputation(socialProfiles);
  assertRange(result.reputation_score, 0, 1000, 'Score');
  assertRange(result.confidence_score, 0, 1, 'Confidence');
  assertTrue(result.breakdown.platforms.twitter !== undefined, 'Should have Twitter breakdown');
});

test('computes score for GitHub-only profile', () => {
  const socialProfiles = {
    github: {
      repos: 15,
      stars: 500,
      contributions: 200,
      account_age_days: 1000
    }
  };
  const result = computeReputation(socialProfiles);
  assertRange(result.reputation_score, 0, 1000, 'Score');
  assertRange(result.confidence_score, 0, 1, 'Confidence');
});

test('gives cross-platform bonus for multiple platforms', () => {
  const singlePlatform = computeReputation({
    twitter: { followers: 1000, account_age_days: 365 }
  });

  const multiPlatform = computeReputation({
    twitter: { followers: 1000, account_age_days: 365 },
    github: { repos: 10, stars: 100 }
  });

  assertTrue(
    multiPlatform.reputation_score > singlePlatform.reputation_score ||
    multiPlatform.confidence_score > singlePlatform.confidence_score,
    'Multi-platform should score better'
  );
});

test('increases confidence with more platforms', () => {
  const twoPlatforms = computeReputation({
    twitter: { followers: 1000 },
    github: { repos: 10 }
  });

  const threePlatforms = computeReputation({
    twitter: { followers: 1000 },
    github: { repos: 10 },
    discord: { servers: 5 }
  });

  assertTrue(
    threePlatforms.confidence_score >= twoPlatforms.confidence_score,
    'More platforms should increase confidence'
  );
});

test('is deterministic - same input gives same output', () => {
  const input = {
    twitter: { followers: 2500, account_age_days: 500 },
    github: { repos: 8, stars: 150 }
  };

  const result1 = computeReputation(input);
  const result2 = computeReputation(input);

  assertEqual(result1.reputation_score, result2.reputation_score, 'Scores');
  assertEqual(result1.confidence_score, result2.confidence_score, 'Confidence');
});

test('handles edge case of zero values', () => {
  const socialProfiles = {
    twitter: { followers: 0, account_age_days: 0, tweets: 0, following: 0 }
  };
  const result = computeReputation(socialProfiles);
  // With all zeros, score is very low (engagement baseline gives ~130)
  assertTrue(result.reputation_score < 200, `Low input should give low score, got ${result.reputation_score}`);
});

test('caps maximum score at 1000', () => {
  const socialProfiles = {
    twitter: { followers: 100000, account_age_days: 5000, tweets: 50000, following: 100 },
    github: { repos: 500, stars: 50000, contributions: 10000, account_age_days: 5000 },
    linkedin: { connections: 5000, posts: 1000, endorsements: 500, account_age_days: 5000 },
    discord: { servers: 100, account_age_days: 3000, nitro: true },
    telegram: { groups: 200, account_age_days: 3000, premium: true }
  };
  const result = computeReputation(socialProfiles);
  assertTrue(result.reputation_score <= 1000, 'Score should not exceed 1000');
});

// ============= Attestation Tests =============

console.log('\n--- Attestation Tests ---');

test('generates valid attestation', async () => {
  const attestation = await generateAttestation({
    daoai_user_id: 'u_12345',
    wallet_address_hash: 'abc123',
    reputation_score: 750,
    confidence_score: 0.85,
    computation_time_ms: 50,
    enclave_identity: getEnclaveIdentity()
  });

  assertTrue(attestation.enclave_id !== undefined, 'Should have enclave_id');
  assertTrue(attestation.attestation_hash !== undefined, 'Should have attestation_hash');
  assertTrue(attestation.signature !== undefined, 'Should have signature');
  assertTrue(attestation.timestamp !== undefined, 'Should have timestamp');
});

test('attestation can be verified', async () => {
  const attestation = await generateAttestation({
    daoai_user_id: 'u_12345',
    wallet_address_hash: 'abc123',
    reputation_score: 750,
    confidence_score: 0.85,
    computation_time_ms: 50,
    enclave_identity: getEnclaveIdentity()
  });

  const verification = await verifyAttestation(attestation);
  assertTrue(verification.valid, 'Attestation should verify');
});

test('enclave identity is consistent', () => {
  const identity1 = getEnclaveIdentity();
  const identity2 = getEnclaveIdentity();
  assertEqual(identity1.enclave_id, identity2.enclave_id, 'Enclave ID');
  assertEqual(identity1.app_hash, identity2.app_hash, 'App hash');
});

// ============= Output Sanitization Tests =============

console.log('\n--- Output Sanitization Tests ---');

test('sanitizes output correctly', () => {
  const output = {
    daoai_user_id: 'u_12345',
    reputation_score: 750,
    confidence_score: 0.85,
    internal_data: 'should be removed',
    wallet_address: '0x123...',
    score_breakdown: {
      platforms: {
        twitter: { score: 80, components: { followers: 70 } }
      },
      platform_count: 1,
      base_score: 750,
      cross_platform_bonus: 0
    }
  };

  const sanitized = sanitizeOutput(output);
  
  assertTrue(sanitized.daoai_user_id !== undefined, 'Should have user ID');
  assertTrue(sanitized.reputation_score !== undefined, 'Should have score');
  assertTrue(sanitized.internal_data === undefined, 'Should not have internal data');
  assertTrue(sanitized.wallet_address === undefined, 'Should not expose wallet address');
});

// ============= Integration Tests =============

console.log('\n--- Integration Tests ---');

test('full workflow: input -> computation -> attestation', async () => {
  const input = {
    daoai_user_id: 'u_82341',
    wallet_address: '0xABC1234567890123456789012345678901234567',
    social_profiles: {
      twitter: { followers: 4300, account_age_days: 1200 },
      github: { repos: 12, stars: 340 }
    }
  };

  // Validate input
  const validation = validateInput(input);
  assertTrue(validation.valid, 'Input should be valid');

  // Compute reputation
  const reputation = computeReputation(input.social_profiles);
  assertRange(reputation.reputation_score, 0, 1000, 'Score');
  assertRange(reputation.confidence_score, 0, 1, 'Confidence');

  // Generate attestation
  const attestation = await generateAttestation({
    daoai_user_id: input.daoai_user_id,
    wallet_address_hash: 'hashed_wallet',
    reputation_score: reputation.reputation_score,
    confidence_score: reputation.confidence_score,
    computation_time_ms: 10,
    enclave_identity: getEnclaveIdentity()
  });

  // Sanitize output
  const output = sanitizeOutput({
    daoai_user_id: input.daoai_user_id,
    reputation_score: reputation.reputation_score,
    confidence_score: reputation.confidence_score,
    score_breakdown: reputation.breakdown,
    attestation
  });

  // Verify final output format
  assertTrue(output.daoai_user_id === 'u_82341', 'Should have correct user ID');
  assertTrue(output.attestation !== undefined, 'Should have attestation');
  assertTrue(output.wallet_address === undefined, 'Should not expose wallet');
});

// ============= Summary =============

console.log('\n=== Test Results ===');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);

if (testsFailed > 0) {
  process.exit(1);
}
