import { CheckCircle, Copy, ExternalLink, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';
import type {
  DeployERC1155Request,
  DeployERC20Request,
  DeployERC721Request,
  DeployNFTResponse,
  ERC20DeployResponse,
} from '../config/api';
import { API_ROUTES, apiClient } from '../config/api';
import { demoDeployInputs } from '../config/demoData';
import { ENV } from '../config/env';

interface DeployResult {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply?: string;
  tokenType: 'ERC20' | 'ERC721' | 'ERC1155';
}

export function DeployToken() {
  const [tokenType, setTokenType] = useState<'ERC20' | 'ERC721' | 'ERC1155'>('ERC20');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState(''); // For ERC20 only
  const [result, setResult] = useState<DeployResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUseDemoValues = () => {
    const demoData = demoDeployInputs[tokenType];
    
    setTokenName(demoData.tokenName);
    setTokenSymbol(demoData.tokenSymbol);
    
    if (tokenType === 'ERC20' && 'totalSupply' in demoData) {
      setTotalSupply(demoData.totalSupply);
    }
  };

  const handleTokenTypeChange = (type: 'ERC20' | 'ERC721' | 'ERC1155') => {
    setTokenType(type);
    setResult(null); // Reset result when changing token type
    // Clear input fields
    setTokenName('');
    setTokenSymbol('');
    setTotalSupply('');
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom validation
    if (!tokenName.trim()) {
      toast.error('Please enter a token name');
      return;
    }
    
    if (!tokenSymbol.trim()) {
      toast.error('Please enter a token symbol');
      return;
    }

    if (tokenType === 'ERC20' && (!totalSupply || parseInt(totalSupply) <= 0)) {
      toast.error('Please enter a valid initial supply');
      return;
    }
    
    setLoading(true);
    
    try {
      
      if (tokenType === 'ERC20') {
        const requestData: DeployERC20Request = {
          tokenName,
          tokenSymbol,
          initialSupply: totalSupply,
        };
        console.log('Sending ERC20 deploy request:', requestData);
        const response = await apiClient.post<ERC20DeployResponse>(API_ROUTES.deploy.erc20, requestData);
        setResult({ 
          ...response.data,
          contractAddress: response.data.address,
          tokenType: 'ERC20' 
        });
        toast.success('ERC20 token deployed successfully!');
      } else if (tokenType === 'ERC721') {
        const requestData: DeployERC721Request = {
          tokenName,
          tokenSymbol,
        };
        console.log('Sending ERC721 deploy request:', requestData);
        const response = await apiClient.post<DeployNFTResponse>(API_ROUTES.deploy.erc721, requestData);
        setResult({ 
          ...response.data,
          contractAddress: response.data.address,
          tokenType: 'ERC721' 
        });
        toast.success('ERC721 NFT contract deployed successfully!');
      } else {
        const requestData: DeployERC1155Request = {
          tokenName,
          tokenSymbol,
        };
        console.log('Sending ERC1155 deploy request:', requestData);
        const response = await apiClient.post<DeployNFTResponse>(API_ROUTES.deploy.erc1155, requestData);
        setResult({ 
          ...response.data,
          contractAddress: response.data.address,
          tokenType: 'ERC1155' 
        });
        toast.success('ERC1155 token contract deployed successfully!');
      }
    } catch (err: any) {
      console.error('Deployment error:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to deploy contract. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      // Check if Clipboard API is available and allowed
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success('Address copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
          return;
        } catch (clipboardError) {
          // Clipboard API failed, fall through to fallback method
          console.log('Clipboard API not available, using fallback');
        }
      }
      
      // Fallback method for non-secure contexts or when Clipboard API is blocked
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      textArea.remove();
      
      if (successful) {
        setCopied(true);
        toast.success('Address copied to clipboard!');
      } else {
        toast.error('Failed to copy address');
      }
    } catch (err) {
      toast.error('Failed to copy address');
      console.error('Copy to clipboard failed:', err);
    }
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl text-white mb-4">Deploy Token Contract</h2>
        <p className="text-gray-400">Launch your own token in minutes</p>
        
        {/* Infura Warning */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 inline-block bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2"
        >
          <p className="text-yellow-400 text-sm">
            ⚠️ Infura endpoint may be rate-limited or temporarily offline. Retrying shortly…
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 self-start lg:sticky lg:top-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl text-white">Deploy Contract</h3>
          </div>

          <form onSubmit={handleDeploy} className="space-y-6">
            {/* Token Type Selector */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Token Standard</label>
              <div className="grid grid-cols-3 gap-3">
                {(['ERC20', 'ERC721', 'ERC1155'] as const).map((type) => (
                  <motion.button
                    key={type}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTokenTypeChange(type)}
                    className={`py-3 rounded-lg transition-all ${
                      tokenType === type
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Token Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Token Name</label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="My Awesome Token"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            {/* Token Symbol */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Token Symbol</label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                placeholder="MAT"
                maxLength={10}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            {/* Initial Supply (ERC20 only) */}
            {tokenType === 'ERC20' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Initial Supply</label>
                <input
                  type="number"
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(e.target.value)}
                  placeholder="1000000"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-400">
                <strong>Note:</strong> Deployment is on Ethereum Testnet (Sepolia). Make sure you have test ETH for gas fees.
              </p>
            </div>

            {/* Demo Values Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUseDemoValues}
              className="w-full py-3 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-all"
            >
              Use Demo Values
            </motion.button>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Deploy Contract
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
          <h3 className="text-2xl text-white mb-6">Deployment Result</h3>

          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Success Message */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-xl text-white mb-2">Deployment Successful!</div>
                <div className="text-sm text-gray-400">Your token contract is now live</div>
              </div>

              {/* Contract Details */}
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Contract Address</div>
                  <div className="text-white break-all font-mono text-sm">{result.contractAddress}</div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => copyToClipboard(result.contractAddress!)}
                    className="mt-2 text-cyan-400 text-sm flex items-center gap-1 hover:text-cyan-300"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </motion.button>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">View on Etherscan</div>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href={`${ENV.ETHERSCAN_BASE_URL}${result.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 text-sm flex items-center gap-1 hover:text-cyan-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Etherscan
                  </motion.a>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Token Name</span>
                  <span className="text-white">{result.tokenName}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Symbol</span>
                  <span className="text-white">{result.tokenSymbol}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Standard</span>
                  <span className="text-purple-400">{result.tokenType}</span>
                </div>

                {result.tokenType === 'ERC20' && 'totalSupply' in result && (
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Total Supply</span>
                    <span className="text-white">{result.totalSupply}</span>
                  </div>
                )}

                {/* Deployer Wallet Info */}
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Deployed By</div>
                  <div className="text-cyan-400 break-all font-mono text-sm mb-2">{ENV.DEPLOYER_WALLET_ADDRESS}</div>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href={`${ENV.ETHERSCAN_BASE_URL}${ENV.DEPLOYER_WALLET_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 text-sm flex items-center gap-1 hover:text-cyan-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Deployer on Etherscan
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Rocket className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400">Fill in the details and deploy to see results</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}