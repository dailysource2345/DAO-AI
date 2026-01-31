import { apiRequest } from "../client/src/lib/queryClient";

const COMPANIES_TO_SEED = [
  {
    externalId: "1",
    name: "MetaMask",
    slug: "metamask",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
    description: "Most popular browser extension wallet for Ethereum and EVM chains",
    website: "https://metamask.io",
    isActive: true,
    isVerified: true,
  },
  {
    externalId: "2",
    name: "Phantom",
    slug: "phantom",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=120&h=120&fit=crop",
    description: "Leading Solana wallet with beautiful UI and seamless NFT support",
    website: "https://phantom.app",
    isActive: true,
    isVerified: true,
  },
  {
    externalId: "3",
    name: "Trust Wallet",
    slug: "trust-wallet",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
    description: "Secure multi-chain wallet trusted by millions worldwide",
    website: "https://trustwallet.com",
    isActive: true,
    isVerified: true,
  },
  {
    externalId: "4",
    name: "Ledger Live",
    slug: "ledger-live",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
    description: "Hardware wallet companion app for maximum security",
    website: "https://ledger.com",
    isActive: true,
    isVerified: true,
  },
  {
    externalId: "5",
    name: "Uniswap",
    slug: "uniswap",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
    description: "Leading decentralized exchange for ERC-20 token swaps",
    website: "https://uniswap.org",
    isActive: true,
    isVerified: true,
  },
  {
    externalId: "6",
    name: "Jupiter",
    slug: "jupiter",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=120&h=120&fit=crop",
    description: "Best liquidity aggregator on Solana with optimal routing",
    website: "https://jup.ag",
    isActive: true,
    isVerified: true,
  },
  {
    externalId: "7",
    name: "PancakeSwap",
    slug: "pancakeswap",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
    description: "Top DEX on BNB Chain with yield farming and more",
    website: "https://pancakeswap.finance",
    isActive: true,
    isVerified: true,
  },
  {
    externalId: "8",
    name: "Raydium",
    slug: "raydium",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
    description: "Automated market maker and liquidity provider on Solana",
    website: "https://raydium.io",
    isActive: true,
    isVerified: true,
  },
  {
    externalId: "9",
    name: "Coinbase Card",
    slug: "coinbase-card",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
    description: "Spend crypto anywhere with cashback rewards",
    website: "https://coinbase.com",
    isActive: true,
    isVerified: true,
  },
  {
    externalId: "10",
    name: "KAST",
    slug: "kast",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
    description: "Global money app for saving, sending, and spending stablecoins with Visa integration",
    website: "https://kast.xyz",
    isActive: true,
    isVerified: true,
  },
  {
    externalId: "11",
    name: "Binance Card",
    slug: "binance-card",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=120&h=120&fit=crop",
    description: "Spend your crypto with zero fees and instant conversion",
    website: "https://binance.com",
    isActive: true,
    isVerified: true,
  },
  {
    externalId: "12",
    name: "BitPay Card",
    slug: "bitpay-card",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=120&h=120&fit=crop",
    description: "Convert and spend crypto in real-time with Mastercard",
    website: "https://bitpay.com",
    isActive: true,
    isVerified: true,
  },
];

async function seedCompanies() {
  console.log("Starting to seed companies...");
  
  for (const company of COMPANIES_TO_SEED) {
    try {
      const response = await fetch("http://localhost:5000/api/admin/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(company),
      });

      if (response.ok) {
        const created = await response.json();
        console.log(`✓ Created: ${company.name}`);
      } else {
        const error = await response.text();
        console.log(`✗ Failed to create ${company.name}: ${error}`);
      }
    } catch (error) {
      console.error(`✗ Error creating ${company.name}:`, error);
    }
  }
  
  console.log("Seeding complete!");
}

seedCompanies().catch(console.error);
