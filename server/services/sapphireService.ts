import { ethers } from 'ethers';

const CONTRACT_ABI = [
  "function linkIdentity(bytes32 userIdHash, bytes memory signature, string memory message, uint256 reputationScore) external",
  "function getReputationScore(bytes32 userIdHash) external view returns (uint256)",
  "function isWalletLinked(address wallet) external view returns (bool)",
  "function updateReputation(bytes32 userIdHash, uint256 newScore) external",
  "event IdentityLinked(bytes32 indexed userIdHash, uint256 reputationScore, uint256 timestamp)"
];

interface LinkIdentityParams {
  userId: string;
  signature: string;
  message: string;
  reputationScore: number;
}

interface SapphireConfig {
  contractAddress: string;
  network: 'mainnet' | 'testnet';
  privateKey?: string;
}

class SapphireService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private signer?: ethers.Wallet;
  private config: SapphireConfig;

  constructor() {
    const network = (process.env.SAPPHIRE_NETWORK || 'mainnet') as 'mainnet' | 'testnet';
    const contractAddress = process.env.SAPPHIRE_CONTRACT_ADDRESS || '';
    
    this.config = {
      contractAddress,
      network,
      privateKey: process.env.SAPPHIRE_PRIVATE_KEY
    };

    const rpcUrl = network === 'mainnet'
      ? 'https://sapphire.oasis.io'
      : 'https://testnet.sapphire.oasis.io';

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    if (this.config.privateKey && contractAddress) {
      this.signer = new ethers.Wallet(this.config.privateKey, this.provider);
      this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.signer);
    } else {
      this.contract = new ethers.Contract(contractAddress || ethers.ZeroAddress, CONTRACT_ABI, this.provider);
    }
  }

  isConfigured(): boolean {
    return Boolean(this.config.contractAddress && this.config.privateKey);
  }

  async linkIdentity(params: LinkIdentityParams): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Sapphire contract not configured' };
    }

    try {
      const userIdHash = ethers.keccak256(ethers.toUtf8Bytes(params.userId));
      
      const tx = await this.contract.linkIdentity(
        userIdHash,
        params.signature,
        params.message,
        params.reputationScore
      );
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Sapphire linkIdentity error:', error);
      return {
        success: false,
        error: error.message || 'Failed to link identity'
      };
    }
  }

  async getReputationScore(userId: string): Promise<number | null> {
    if (!this.config.contractAddress) {
      return null;
    }

    try {
      const userIdHash = ethers.keccak256(ethers.toUtf8Bytes(userId));
      const score = await this.contract.getReputationScore(userIdHash);
      return Number(score);
    } catch (error) {
      console.error('Sapphire getReputationScore error:', error);
      return null;
    }
  }

  async isWalletLinked(walletAddress: string): Promise<boolean> {
    if (!this.config.contractAddress) {
      return false;
    }

    try {
      return await this.contract.isWalletLinked(walletAddress);
    } catch (error) {
      console.error('Sapphire isWalletLinked error:', error);
      return false;
    }
  }

  async updateReputation(userId: string, newScore: number): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Sapphire contract not configured' };
    }

    try {
      const userIdHash = ethers.keccak256(ethers.toUtf8Bytes(userId));
      const tx = await this.contract.updateReputation(userIdHash, newScore);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Sapphire updateReputation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update reputation'
      };
    }
  }

  getExplorerUrl(txHash: string): string {
    return `https://explorer.oasis.io/${this.config.network}/sapphire/tx/${txHash}`;
  }

  getContractUrl(): string {
    if (!this.config.contractAddress) return '';
    return `https://explorer.oasis.io/${this.config.network}/sapphire/address/${this.config.contractAddress}`;
  }
}

export const sapphireService = new SapphireService();
export default sapphireService;
