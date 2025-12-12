import { CheckCircle, Coins, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';
import type {
  MintERC1155Request,
  MintERC20Request,
  MintERC721Request,
  MintResponse,
} from '../config/api';
import { API_ROUTES, apiClient } from '../config/api';
import { demoMintInputs } from '../config/demoData';
import { validateEthereumAddressWithToast } from '../utils/validation';

export function MintToken() {
  const [tokenType, setTokenType] = useState<'ERC20' | 'ERC721' | 'ERC1155'>('ERC20'); // Changed default from ERC721 to ERC20
  const [contractAddress, setContractAddress] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenId, setTokenId] = useState('1'); // For ERC1155
  const [result, setResult] = useState<MintResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUseDemoValues = () => {
    const demoData = demoMintInputs[tokenType];
    
    if (tokenType === 'ERC20') {
      setContractAddress(demoData.contractAddress);
      setRecipientAddress(demoData.recipientAddress);
      setAmount(demoData.amount);
    } else if (tokenType === 'ERC721') {
      setContractAddress(demoData.contractAddress);
      setTokenURI(demoData.tokenURI);
    } else {
      // ERC1155
      setContractAddress(demoData.contractAddress);
      setRecipientAddress(demoData.recipientAddress);
      setTokenURI(demoData.tokenURI);
      setAmount(demoData.amount);
    }
  };

  const handleTokenTypeChange = (type: 'ERC20' | 'ERC721' | 'ERC1155') => {
    setTokenType(type);
    setResult(null); // Reset result when changing token type
    // Clear input fields
    setContractAddress('');
    setTokenURI('');
    setRecipientAddress('');
    setAmount('');
    setTokenId('1');
  };

  const handleAddressBlur = (address: string, fieldName: string) => {
    // Only validate if address is not empty
    if (address.trim()) {
      validateEthereumAddressWithToast(address, fieldName);
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate contract address
    if (!validateEthereumAddressWithToast(contractAddress, 'contract address')) {
      return;
    }
    
    if (tokenType === 'ERC20') {
      if (!validateEthereumAddressWithToast(recipientAddress, 'recipient address')) {
        return;
      }
      if (!amount || parseInt(amount) < 1) {
        toast.error('Please enter a valid amount (minimum 1)');
        return;
      }
    } else if (tokenType === 'ERC721') {
      if (!tokenURI.trim()) {
        toast.error('Please enter a token URI');
        return;
      }
    } else {
      // ERC1155
      if (!validateEthereumAddressWithToast(recipientAddress, 'recipient address')) {
        return;
      }
      if (!tokenURI.trim()) {
        toast.error('Please enter a token URI');
        return;
      }
      if (!amount || parseInt(amount) < 1) {
        toast.error('Please enter a valid amount (minimum 1)');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      let response;
      
      if (tokenType === 'ERC20') {
        const requestData: MintERC20Request = {
          contractAddress,
          to: recipientAddress,
          amount,
        };
        response = await apiClient.post(API_ROUTES.mint.erc20, requestData);
        toast.success('ERC20 tokens minted successfully!');
      } else if (tokenType === 'ERC721') {
        const requestData: MintERC721Request = {
          contractAddress,
          tokenURI,
        };
        response = await apiClient.post(API_ROUTES.mint.erc721, requestData);
        toast.success('ERC721 NFT minted successfully!');
      } else {
        const requestData: MintERC1155Request = {
          contractAddress,
          to: recipientAddress,
          amount,
          tokenURI,
        };
        response = await apiClient.post(API_ROUTES.mint.erc1155, requestData);
        toast.success('ERC1155 tokens minted successfully!');
      }
      
      setResult(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to mint token. Please try again.');
      console.error('Minting error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl text-white mb-4">Mint Token</h2>
        <p className="text-gray-400">Create new tokens or NFTs</p>
        
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl text-white">Mint Tokens</h3>
          </div>

          <form onSubmit={handleMint} className="space-y-6">
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
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Contract Address */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Contract Address</label>
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all"
              />
            </div>

            {/* Token URI (for ERC721 and ERC1155) */}
            {(tokenType === 'ERC721' || tokenType === 'ERC1155') && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Token URI (Metadata)</label>
                <input
                  type="text"
                  value={tokenURI}
                  onChange={(e) => setTokenURI(e.target.value)}
                  placeholder="ipfs://... or https://..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  IPFS URL or HTTP URL pointing to token metadata JSON
                </p>
              </div>
            )}

            {/* Recipient Address (for ERC20 and ERC1155) */}
            {(tokenType === 'ERC20' || tokenType === 'ERC1155') && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all"
                />
              </div>
            )}

            {/* Amount (for ERC20 and ERC1155) */}
            {(tokenType === 'ERC20' || tokenType === 'ERC1155') && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all"
                />
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-400">
                <strong>Tip:</strong> Make sure you have ownership or minting rights for this contract address.
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
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-xl hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Coins className="w-5 h-5" />
                  Mint Token
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
          <h3 className="text-2xl text-white mb-6">Minting Result</h3>

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
                <div className="text-xl text-white mb-2">Token Minted Successfully!</div>
                <div className="text-sm text-gray-400">Your token has been created</div>
              </div>

              {/* Minting Details */}
              <div className="space-y-4">
                {result.tokenId && (
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Token ID</div>
                    <div className="text-2xl text-white">#{result.tokenId}</div>
                  </div>
                )}

                {result.transactionHash && (
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Transaction Hash</div>
                    <div className="text-white break-all font-mono text-sm">{result.transactionHash}</div>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href={`https://sepolia.etherscan.io/tx/${result.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-cyan-400 text-sm flex items-center gap-1 hover:text-cyan-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Etherscan
                    </motion.a>
                  </div>
                )}

                {result.amount && (
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Amount Minted</span>
                    <span className="text-white">{result.amount}</span>
                  </div>
                )}

                {result.recipient && (
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Recipient</div>
                    <div className="text-white break-all font-mono text-sm">{result.recipient}</div>
                  </div>
                )}

                {result.contractAddress && (
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Contract Address</div>
                    <div className="text-white break-all font-mono text-sm">{result.contractAddress}</div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Coins className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400">Fill in the details and mint to see results</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}