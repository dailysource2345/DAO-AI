import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Shield, Wallet } from "lucide-react";

export default function RoflTest() {
  const [status, setStatus] = useState<"idle" | "connecting" | "signing" | "verifying" | "success" | "error">("idle");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [result, setResult] = useState<{
    wallet_hash?: string;
    reputation_score?: number;
    confidence_score?: number;
    attestation?: {
      enclave_id: string;
      app_hash: string;
      tee_type: string;
      signature: { mode: string };
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testRoflFlow = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      setError("Please install MetaMask or another Web3 wallet");
      setStatus("error");
      return;
    }

    try {
      setStatus("connecting");
      setError(null);

      const accounts = await ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const address = accounts[0];
      setWalletAddress(address);

      setStatus("signing");
      const timestamp = Date.now();
      const challenge = `DAOAI Identity Verification\nLink your wallet to your DAO AI profile\nTimestamp: ${timestamp}`;

      const signature = await ethereum.request({
        method: "personal_sign",
        params: [challenge, address],
      }) as string;

      setStatus("verifying");

      const response = await fetch("/api/rofl/link-identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          signedMessage: signature,
          challenge,
          socialProfiles: {
            twitter: { followers: 1000, account_age_days: 365, tweets: 500 },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "ROFL verification failed");
      }

      setResult(data);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ROFL Verification Test</h1>
          <p className="text-gray-400">Test the confidential wallet-to-identity linking flow</p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Privacy-Preserving Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="text-gray-300">This test will:</p>
              <ol className="list-decimal list-inside text-gray-400 space-y-1">
                <li>Connect your wallet</li>
                <li>Sign a challenge message (proves ownership)</li>
                <li>Send signature to ROFL (wallet address NOT sent)</li>
                <li>ROFL recovers address, computes score, returns hash</li>
              </ol>
              <p className="text-green-400 text-xs mt-2">
                Your wallet address is NEVER visible to our backend
              </p>
            </div>

            {status === "idle" && (
              <Button onClick={testRoflFlow} className="w-full bg-purple-600 hover:bg-purple-700">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet & Test ROFL
              </Button>
            )}

            {(status === "connecting" || status === "signing" || status === "verifying") && (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                <span className="text-gray-300">
                  {status === "connecting" && "Connecting wallet..."}
                  {status === "signing" && "Please sign the message in your wallet..."}
                  {status === "verifying" && "ROFL verifying signature..."}
                </span>
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
                <Button onClick={() => setStatus("idle")} variant="outline" className="mt-3">
                  Try Again
                </Button>
              </div>
            )}

            {status === "success" && result && (
              <div className="space-y-4">
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-400 mb-3">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">ROFL Verification Successful!</span>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Your Wallet (visible to you only)</p>
                    <p className="text-white font-mono text-sm">{walletAddress}</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Wallet Hash (what backend sees)</p>
                    <p className="text-purple-400 font-mono text-xs break-all">{result.wallet_hash}</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-xs">Reputation Score</p>
                      <p className="text-2xl font-bold text-white">{result.reputation_score}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Confidence</p>
                      <p className="text-lg text-gray-300">{(result.confidence_score || 0) * 100}%</p>
                    </div>
                  </div>

                  {result.attestation && (
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-gray-500 text-xs mb-2">TEE Attestation</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Enclave ID:</span>
                          <span className="text-white font-mono">{result.attestation.enclave_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">TEE Type:</span>
                          <Badge variant="outline" className="text-green-400 border-green-600">
                            {result.attestation.tee_type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Mode:</span>
                          <Badge className={result.attestation.signature.mode === "production-tee" ? "bg-green-600" : "bg-yellow-600"}>
                            {result.attestation.signature.mode}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button onClick={() => { setStatus("idle"); setResult(null); }} variant="outline" className="w-full">
                  Test Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">On-Chain Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-3">
              View your Sapphire contract on Oasis Explorer:
            </p>
            <a
              href="https://explorer.oasis.io/mainnet/sapphire/address/0xCE1CD92aa80F133cc2D0F4fe232F790288785d95"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 text-sm underline"
            >
              0xCE1CD92...8785d95 →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
