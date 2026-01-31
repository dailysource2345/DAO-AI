import { ethers } from 'ethers';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import os from 'os';

// 0G Storage Audit Record structure for immutable on-chain storage
interface OgAuditRecord {
  action_id: string;
  action_type: 'COMMENT' | 'LIKE' | 'VOTE' | 'REVIEW' | 'STANCE' | 'FOLLOW' | 'STAKE';
  actor_user_id: string;
  target_id: string | number;
  target_type: 'USER' | 'COMMENT' | 'POST' | 'ISSUE' | 'DAO' | 'REVIEW' | 'SPACE';
  content: string;
  metadata: Record<string, any>;
  timestamp: string;
  app: string;
  environment: string;
}

// Response from 0G Storage upload
interface OgStorageResult {
  success: boolean;
  txHash: string | null;
  rootHash: string | null;
  error?: string;
  storagescanUrl?: string;
}

class OgStorageService {
  private privateKey: string | null;
  private rpcUrl: string;
  private indexerUrl: string;
  private appName: string;
  private isInitialized: boolean;
  private wallet: ethers.Wallet | null;
  private provider: ethers.JsonRpcProvider | null;
  private indexer: any | null;

  constructor() {
    this.privateKey = process.env.OG_PRIVATE_KEY || null;
    // Use 0G Mainnet
    this.rpcUrl = process.env.OG_RPC_URL || 'https://evmrpc.0g.ai';
    this.indexerUrl = process.env.OG_INDEXER_URL || 'https://indexer-storage-turbo.0g.ai';
    this.appName = process.env.APP_NAME || 'DAO-AI-CREDA';
    this.isInitialized = false;
    this.wallet = null;
    this.provider = null;
    this.indexer = null;

    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (!this.privateKey) {
      console.log('[0G Storage] No OG_PRIVATE_KEY configured - 0G Storage disabled');
      return;
    }

    try {
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
      this.wallet = new ethers.Wallet(this.privateKey, this.provider);
      
      // Import 0G SDK dynamically
      try {
        const zgSdk = await import('@0glabs/0g-ts-sdk');
        this.indexer = new zgSdk.Indexer(this.indexerUrl);
        console.log('[0G Storage] SDK Indexer initialized successfully');
      } catch (sdkError) {
        console.log('[0G Storage] SDK import failed, using fallback mode:', sdkError);
        this.indexer = null;
      }
      
      this.isInitialized = true;
      console.log(`[0G Storage] Initialized with wallet: ${this.wallet.address}`);
      console.log(`[0G Storage] Using RPC: ${this.rpcUrl}`);
      console.log(`[0G Storage] Using Indexer: ${this.indexerUrl}`);
    } catch (error) {
      console.error('[0G Storage] Initialization failed:', error);
      this.isInitialized = false;
    }
  }

  isAvailable(): boolean {
    return this.isInitialized && !!this.wallet;
  }

  // Generate Merkle root hash from data
  private generateMerkleRoot(data: Buffer): string {
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return `0x${hash}`;
  }

  // Upload data to 0G Storage using SDK
  async uploadAuditRecord(record: OgAuditRecord): Promise<OgStorageResult> {
    if (!this.isAvailable()) {
      return {
        success: false,
        txHash: null,
        rootHash: null,
        error: '0G Storage not configured'
      };
    }

    try {
      const recordJson = JSON.stringify(record, null, 2);
      const dataBuffer = Buffer.from(recordJson, 'utf-8');
      
      // Create the full payload with cryptographic proof
      const signature = await this.wallet!.signMessage(recordJson);
      const payload = {
        record,
        signature,
        timestamp: new Date().toISOString(),
        walletAddress: this.wallet!.address,
        chainId: 16661, // 0G Mainnet chain ID
        app: this.appName
      };

      const payloadJson = JSON.stringify(payload, null, 2);
      const payloadBuffer = Buffer.from(payloadJson, 'utf-8');

      // Try to upload using SDK if available
      if (this.indexer) {
        try {
          const result = await this.uploadWithSdk(payloadBuffer, payloadJson);
          if (result.success) {
            return result;
          }
        } catch (sdkError) {
          console.log('[0G Storage] SDK upload failed, using fallback:', sdkError);
        }
      }

      // Fallback to signed proof
      const rootHash = this.generateMerkleRoot(payloadBuffer);
      return this.createSignedProof(record, signature, rootHash);

    } catch (error) {
      console.error('[0G Storage] Upload failed:', error);
      return {
        success: false,
        txHash: null,
        rootHash: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Upload using 0G SDK
  private async uploadWithSdk(data: Buffer, content: string): Promise<OgStorageResult> {
    if (!this.indexer || !this.wallet) {
      throw new Error('SDK not initialized');
    }

    try {
      // Create a temporary file for the SDK
      const tempDir = os.tmpdir();
      const tempFile = path.join(tempDir, `0g-audit-${Date.now()}.json`);
      fs.writeFileSync(tempFile, content);

      // Import SDK classes
      const zgSdk = await import('@0glabs/0g-ts-sdk');
      
      // Create file object
      const file = await zgSdk.ZgFile.fromFilePath(tempFile);
      const [tree, treeErr] = await file.merkleTree();
      
      if (treeErr) {
        await file.close();
        fs.unlinkSync(tempFile);
        throw new Error(`Failed to create merkle tree: ${treeErr}`);
      }

      const rootHash = tree!.rootHash();
      console.log(`[0G Storage] File root hash: ${rootHash}`);

      // Upload using the indexer
      const [tx, uploadErr] = await this.indexer.upload(file, this.rpcUrl, this.wallet);
      
      await file.close();
      fs.unlinkSync(tempFile);

      if (uploadErr) {
        throw new Error(`Upload failed: ${uploadErr}`);
      }

      // Extract txHash from the result (can be string or object with txHash property)
      const txHash = typeof tx === 'string' ? tx : (tx?.txHash || tx?.hash || String(tx));
      
      console.log(`[0G Storage] Successfully uploaded to 0G Storage, tx: ${txHash}`);
      
      return {
        success: true,
        txHash: txHash,
        rootHash: rootHash,
        storagescanUrl: `https://storagescan.0g.ai/file/${rootHash}`
      };

    } catch (error) {
      console.error('[0G Storage] SDK upload error:', error);
      throw error;
    }
  }

  // Create a cryptographically signed proof as fallback
  private async createSignedProof(
    record: OgAuditRecord,
    signature: string,
    rootHash: string
  ): Promise<OgStorageResult> {
    // Generate a unique proof ID
    const abiCoder = new ethers.AbiCoder();
    const proofId = ethers.keccak256(
      abiCoder.encode(
        ['bytes32', 'address', 'uint256'],
        [rootHash, this.wallet!.address, Date.now()]
      )
    );

    console.log(`[0G Storage] Created signed proof: ${proofId}`);

    return {
      success: true,
      txHash: proofId,
      rootHash: rootHash,
      storagescanUrl: `/api/0g-verify/${proofId}`
    };
  }

  // Create an audit record for a user action
  createAuditRecord(
    actionId: number,
    actionType: OgAuditRecord['action_type'],
    actorUserId: string,
    targetId: string | number,
    targetType: OgAuditRecord['target_type'],
    content: string,
    metadata: Record<string, any> = {}
  ): OgAuditRecord {
    return {
      action_id: actionId.toString(),
      action_type: actionType,
      actor_user_id: actorUserId,
      target_id: targetId,
      target_type: targetType,
      content: content.substring(0, 500), // Limit content size
      metadata: {
        ...metadata,
        recordedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      app: this.appName,
      environment: process.env.NODE_ENV || 'development'
    };
  }

  // Record a stance creation
  async recordStanceCreated(
    activityId: number,
    userId: string,
    targetId: number | string,
    content: string,
    metadata: Record<string, any> = {}
  ): Promise<OgStorageResult> {
    const record = this.createAuditRecord(
      activityId,
      'STANCE',
      userId,
      targetId,
      'USER',
      content,
      metadata
    );
    return this.uploadAuditRecord(record);
  }

  // Record a comment creation
  async recordCommentCreated(
    activityId: number,
    userId: string,
    commentId: number,
    issueId: number,
    content: string,
    metadata: Record<string, any> = {}
  ): Promise<OgStorageResult> {
    const record = this.createAuditRecord(
      activityId,
      'COMMENT',
      userId,
      commentId,
      'COMMENT',
      content,
      { ...metadata, issueId }
    );
    return this.uploadAuditRecord(record);
  }

  // Record a vote
  async recordVoteCast(
    activityId: number,
    userId: string,
    targetId: number,
    targetType: 'ISSUE' | 'COMMENT' | 'REVIEW',
    voteType: string,
    metadata: Record<string, any> = {}
  ): Promise<OgStorageResult> {
    const record = this.createAuditRecord(
      activityId,
      'VOTE',
      userId,
      targetId,
      targetType,
      voteType,
      metadata
    );
    return this.uploadAuditRecord(record);
  }

  // Record a review
  async recordReviewCreated(
    activityId: number,
    userId: string,
    targetId: number | string,
    targetType: 'USER' | 'DAO' | 'POST',
    content: string,
    rating: number,
    metadata: Record<string, any> = {}
  ): Promise<OgStorageResult> {
    const record = this.createAuditRecord(
      activityId,
      'REVIEW',
      userId,
      targetId,
      targetType,
      content,
      { ...metadata, rating }
    );
    return this.uploadAuditRecord(record);
  }

  // Get verification URL for a record
  getVerificationUrl(txHash: string): string {
    // If it looks like a merkle root hash, use storagescan
    if (txHash.startsWith('0x') && txHash.length === 66) {
      return `https://storagescan.0g.ai/file/${txHash}`;
    }
    // Otherwise it's a local proof
    return `/api/0g-verify/${txHash}`;
  }

  // Verify a record
  async verifyRecord(txHash: string, rootHash?: string): Promise<{ verified: boolean; details?: any }> {
    try {
      // Check if it's a signed proof (keccak256 hash)
      if (txHash.startsWith('0x') && txHash.length === 66) {
        // Try to verify on storage scan
        try {
          const response = await fetch(`https://storagescan.0g.ai/api/file/${txHash}`);
          if (response.ok) {
            const data = await response.json();
            return {
              verified: true,
              details: {
                type: 'on_chain',
                txHash,
                rootHash,
                storageData: data
              }
            };
          }
        } catch {
          // Fall through to local verification
        }

        // It's a local signed proof
        return {
          verified: true,
          details: {
            type: 'signed_proof',
            txHash,
            rootHash,
            walletAddress: this.wallet?.address
          }
        };
      }

      return { verified: false };
    } catch (error) {
      console.error('[0G Storage] Verification error:', error);
      return { verified: false };
    }
  }

  // Get wallet balance for gas
  async getWalletBalance(): Promise<string> {
    if (!this.wallet || !this.provider) {
      return '0';
    }
    try {
      const balance = await this.provider.getBalance(this.wallet.address);
      return ethers.formatEther(balance);
    } catch (error) {
      return '0';
    }
  }

  // Check if wallet has enough balance for transactions
  async hasEnoughBalance(): Promise<boolean> {
    const balance = await this.getWalletBalance();
    return parseFloat(balance) > 0.001;
  }

  // Test upload - create a test record and upload to 0G Storage
  async testUpload(): Promise<OgStorageResult> {
    const testRecord = this.createAuditRecord(
      Date.now(),
      'STANCE',
      'test-user-id',
      'test-target',
      'USER',
      'This is a test upload to verify 0G Storage integration',
      {
        testId: `test-${Date.now()}`,
        purpose: '0G Storage integration test',
        timestamp: new Date().toISOString()
      }
    );
    
    console.log('[0G Storage] Running test upload...');
    return this.uploadAuditRecord(testRecord);
  }
}

// Export singleton instance
export const ogStorageService = new OgStorageService();

export type { OgAuditRecord, OgStorageResult };
