# DAO AI ROFL: Confidential Identity Linking

A ROFL (Runtime Off-chain Logic Framework) application for Oasis Sapphire that enables privacy-preserving wallet-to-social-profile linking with verifiable reputation scoring.

## Overview

This application runs inside an Oasis ROFL TEE (Trusted Execution Environment) enclave, providing:

- **Confidential wallet-social linking**: Wallet addresses never leave the enclave
- **Deterministic reputation scoring**: Same inputs always produce identical scores
- **Remote attestation**: Cryptographic proof of genuine TEE execution
- **Stateless design**: No data persists between requests

## Privacy Architecture

The key innovation is that **wallet addresses never touch the backend server**. Users sign messages client-side, and only the signature is forwarded to the enclave, which recovers the address internally.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
│  ┌─────────────┐    ┌─────────────────────┐                         │
│  │   Wallet    │───▶│  Sign Challenge     │                         │
│  │  (MetaMask) │    │  Message            │                         │
│  └─────────────┘    └──────────┬──────────┘                         │
│                                │ signature (no address sent)        │
└────────────────────────────────┼────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVER                              │
│                                                                     │
│   Receives: { signature, challenge, social_profiles }              │
│   Never sees: wallet address                                       │
│                                                                     │
└───────────────────────────────┬────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│                    ROFL TEE ENCLAVE (Intel TDX)                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  1. Verify signature cryptographically                      │   │
│  │  2. Recover wallet address from signature                   │   │
│  │  3. Link wallet ↔ social profiles (internal only)           │   │
│  │  4. Compute deterministic reputation score                  │   │
│  │  5. Generate remote attestation                             │   │
│  │                                                              │   │
│  │  Output: { wallet_hash, score, attestation }                │   │
│  │  Wallet address is NEVER returned                           │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

## Security Guarantees

| Property | Description |
|----------|-------------|
| **Confidentiality** | Wallet ↔ social linking happens only inside the enclave |
| **Integrity** | Remote attestation proves genuine TEE execution |
| **Statelessness** | No data persists between requests |
| **Determinism** | Same input always produces same output |
| **Privacy** | Wallet addresses are never exposed in outputs |

## API Endpoints

### POST /compute

Confidential reputation computation with signature-based wallet recovery.

**Request:**
```json
{
  "signed_message": "0x...",
  "challenge": "DAO AI Identity Verification\nTimestamp: 1706500000000",
  "daoai_user_id": "user_12345",
  "social_profiles": {
    "twitter": {
      "followers": 5000,
      "account_age_days": 730,
      "tweets": 1200
    },
    "github": {
      "repos": 25,
      "stars": 150,
      "contributions": 400
    }
  }
}
```

**Response:**
```json
{
  "daoai_user_id": "user_12345",
  "wallet_hash": "a3f2b8c9d4e5...",
  "reputation_score": 725,
  "confidence_score": 0.85,
  "score_breakdown": {
    "platforms": {
      "twitter": { "score": 82, "components": {...} },
      "github": { "score": 78, "components": {...} }
    },
    "platform_count": 2,
    "cross_platform_bonus": 25
  },
  "attestation": {
    "version": "1.0",
    "type": "rofl-remote-attestation",
    "enclave_id": "rofl-enclave-...",
    "app_hash": "86f475...",
    "tee_type": "tdx",
    "attestation_hash": "...",
    "signature": {
      "algorithm": "hmac-sha256",
      "value": "...",
      "mode": "production-tee"
    },
    "timestamp": "2025-01-29T12:00:00Z"
  }
}
```

### GET /health

Returns enclave health status and identity information.

### POST /verify-attestation

Verifies a previously generated attestation.

## Reputation Scoring Model

The reputation score (0-1000) is computed from weighted social profile metrics:

| Platform | Weight | Metrics |
|----------|--------|---------|
| GitHub | 30% | Repositories, Stars, Contributions, Account Age |
| Twitter | 25% | Followers, Account Age, Tweets, Engagement Ratio |
| LinkedIn | 20% | Connections, Account Age, Posts, Endorsements |
| Discord | 15% | Servers, Account Age, Nitro Status |
| Telegram | 10% | Groups, Account Age, Premium Status |

### Scoring Factors

1. **Cross-platform Presence**: Bonus points (up to +100) for multiple verified platforms
2. **Account Longevity**: Older accounts score higher, indicating established identity
3. **Engagement Quality**: Follower ratios, contribution patterns
4. **Activity Level**: Active participation signals genuine usage

### Confidence Score

The confidence score (0-1) reflects data quality:
- More platforms = higher confidence
- Consistent scores across platforms = higher confidence
- Single platform = lower confidence (0.4)
- Three+ platforms = high confidence (0.75+)

## Deployment

### Prerequisites

- Docker installed
- Oasis wallet with ROSE tokens
- [Oasis CLI](https://github.com/oasisprotocol/cli)

### Build Docker Image

```bash
cd rofl-app
docker build -t daoai-rofl-app .
docker save daoai-rofl-app -o daoai-rofl-app.tar
```

### Deploy to Oasis ROFL

1. Navigate to [rofl.app](https://rofl.app)
2. Connect your Oasis wallet
3. Create a new ROFL application
4. Upload the `daoai-rofl-app.tar` image
5. Select a TEE machine provider and rental duration
6. Copy the proxy URL after deployment

### Backend Configuration

After deployment, configure your backend with the proxy URL:

```bash
ROFL_ENDPOINT=https://p8080.mXXX.rofl.app
ROFL_MODE=enclave
ROFL_TEE_TYPE=tdx
```

## On-Chain Integration

The companion Sapphire smart contract stores wallet hashes and reputation scores on-chain:

**Mainnet Contract:** [`0xCE1CD92aa80F133cc2D0F4fe232F790288785d95`](https://explorer.oasis.io/mainnet/sapphire/address/0xCE1CD92aa80F133cc2D0F4fe232F790288785d95)

The contract stores:
- Wallet hash (SHA-256, not the actual address)
- Reputation score
- Attestation signature
- Computation timestamp

## File Structure

```
rofl-app/
├── src/
│   ├── main.js               # Application entry point and request routing
│   ├── server.js             # HTTP server implementation
│   ├── attestation.js        # Remote attestation generation
│   ├── reputation.js         # Deterministic scoring algorithm
│   ├── validation.js         # Input validation and output sanitization
│   ├── walletVerification.js # Signature verification and address recovery
│   └── test.js               # Test suite (17 tests)
├── Dockerfile                # Container build configuration
├── package.json              # Node.js dependencies
├── rofl.yaml                 # ROFL deployment configuration
└── README.md
```

## Testing

Run the complete test suite:

```bash
cd rofl-app
npm install
node src/test.js
```

Expected output: **17/17 tests passing**

Test coverage includes:
- Signature verification and wallet recovery
- Reputation score computation across all platforms
- Attestation generation and verification
- Input validation edge cases
- Output sanitization (no wallet address leakage)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP server port | 8080 |
| `ROFL_MODE` | Execution mode (`development` or `enclave`) | development |
| `ROFL_TEE_TYPE` | TEE type (`sgx` or `tdx`) | sgx |
| `ROFL_ENCLAVE_ID` | Enclave identifier | Auto-generated |
| `ROFL_APP_HASH` | Application measurement hash | Auto-generated |

## Attestation Verification

To verify a ROFL attestation:

1. Confirm `enclave_id` matches the expected deployed enclave
2. Verify `app_hash` matches the deployed application version
3. Check `signature.mode` is `production-tee` (not `development-simulated`)
4. Validate `timestamp` is recent (attestations expire after 1 hour)
5. Optionally verify against Oasis attestation verification service

## License

MIT License

## Contact

For integration support or questions about the ROFL implementation, please open an issue in this repository.
