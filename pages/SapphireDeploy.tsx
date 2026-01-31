import { SapphireDeployment } from '@/components/SapphireDeployment';

export default function SapphireDeploy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Oasis Sapphire Deployment
          </h1>
          <p className="text-muted-foreground mt-2">
            Deploy confidential identity contracts to Oasis Sapphire mainnet
          </p>
        </div>
        
        <SapphireDeployment />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Oasis Sapphire provides confidential smart contracts using Intel SGX TEE technology.
          </p>
          <p className="mt-1">
            Your wallet address is verified on-chain but never exposed to the backend.
          </p>
        </div>
      </div>
    </div>
  );
}
