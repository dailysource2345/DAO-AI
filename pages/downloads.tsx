import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink } from "lucide-react";

export default function Downloads() {
  const documents = [
    {
      name: "OASIS_ROFL_INTEGRATION.md",
      downloadName: "OASIS_ROFL_INTEGRATION.txt",
      title: "Oasis ROFL Integration Guide",
      description: "Complete documentation for Oasis team review - covers confidential wallet linking, verifiable reputation scoring, and TEE deployment.",
      size: "18 KB"
    },
    {
      name: "README.md",
      downloadName: "README.txt",
      title: "Project README",
      description: "Project overview with quick links, architecture diagram, and getting started guide.",
      size: "6 KB"
    },
    {
      name: "DEPLOY_ROFL.md",
      downloadName: "DEPLOY_ROFL.txt",
      title: "ROFL Deployment Guide",
      description: "Step-by-step instructions for deploying ROFL to Oasis Sapphire mainnet.",
      size: "6 KB"
    }
  ];

  const handleDownload = async (filename: string, downloadName: string) => {
    try {
      const response = await fetch(`/api/download/${filename}`);
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            DAO AI Documentation
          </h1>
          <p className="text-gray-300 text-lg">
            Download documentation for the Oasis ROFL integration
          </p>
          <a 
            href="https://explorer.oasis.io/mainnet/sapphire/rofl/app/rofl1qp4fsmunh08v6hs2zmmklarjqglj7nnalgagcdag"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View ROFL App on Oasis Explorer
          </a>
        </div>

        <div className="grid gap-6">
          {documents.map((doc) => (
            <Card key={doc.name} className="bg-gray-800/50 border-purple-500/30 backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <FileText className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{doc.title}</CardTitle>
                      <CardDescription className="text-gray-400 font-mono text-sm">
                        {doc.name} ({doc.size})
                      </CardDescription>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleDownload(doc.name, doc.downloadName)}
                    className="bg-purple-600 hover:bg-purple-500"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{doc.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-800/30 rounded-xl border border-purple-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>ROFL App ID:</span>
              <code className="text-purple-400">rofl1qp4fsmunh08v6hs2zmmklarjqglj7nnalgagcdag</code>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Sapphire Contract:</span>
              <code className="text-purple-400">0xCE1CD92aa80F133cc2D0F4fe232F790288785d95</code>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Machine ID:</span>
              <code className="text-purple-400">0000000000000085</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
