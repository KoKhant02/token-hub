import { CheckCircle, Copy, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { ERC20BalanceResponse, NFTBalanceResponse, NFTItem } from '../config/api';
import { API_ROUTES, apiClient } from '../config/api';
import { demoBalanceInputs } from '../config/demoData';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { validateEthereumAddressWithToast } from '../utils/validation';
import { AnimatedButton } from './ui/AnimatedButton';
import { EtherscanLink } from './ui/EtherscanLink';
import { FormInput } from './ui/FormInput';
import { TokenTypeTabs } from './ui/TokenTypeTabs';

// Demo values for each token type
const demoValues = demoBalanceInputs;

export function BalanceCheck() {
  const [tokenType, setTokenType] = useState<'ERC20' | 'ERC721' | 'ERC1155'>('ERC20');
  const [walletAddress, setWalletAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [result, setResult] = useState<ERC20BalanceResponse | NFTBalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { copied, copyToClipboard } = useCopyToClipboard();

  const handleUseDemoValues = () => {
    const demo = demoValues[tokenType];
    setWalletAddress(demo.wallet);
    setContractAddress(demo.contract);
  };

  const handleTokenTypeChange = (type: 'ERC20' | 'ERC721' | 'ERC1155') => {
    setTokenType(type);
    setResult(null); // Clear result for new token type
    setError(null);
    // Clear input fields
    setWalletAddress('');
    setContractAddress('');
  };

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate addresses using reusable function
    if (!validateEthereumAddressWithToast(walletAddress, 'wallet address')) {
      return;
    }
    
    if (!validateEthereumAddressWithToast(contractAddress, 'contract address')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      const params = {
        walletAddress,
        contractAddress,
      };

      if (tokenType === 'ERC20') {
        response = await apiClient.get<ERC20BalanceResponse>(API_ROUTES.balance.erc20, { params });
        setResult(response.data);
      } else if (tokenType === 'ERC721') {
        response = await apiClient.get<NFTBalanceResponse>(API_ROUTES.balance.erc721, { params });
        
        // Fetch images for NFT items
        if (response.data.nftItems && response.data.nftItems.length > 0) {
          const updatedNftItems = await Promise.all(
            response.data.nftItems.map(async (item: NFTItem) => {
              let imageUrl = "";
              try {
                if (item.tokenURI) {
                  const tokenData = await fetch(item.tokenURI).then((res) => res.json());
                  imageUrl = tokenData.image; // Extract image from tokenURI JSON
                }
              } catch (err) {
                console.error("Failed to fetch token URI:", err);
              }

              return {
                ...item,
                image: imageUrl, // Add image field
              };
            })
          );

          setResult({
            ...response.data,
            nftItems: updatedNftItems,
          });
        } else {
          setResult(response.data);
        }
      } else {
        response = await apiClient.get<NFTBalanceResponse>(API_ROUTES.balance.erc1155, { params });
        
        // Fetch images for NFT items
        if (response.data.nftItems && response.data.nftItems.length > 0) {
          const updatedNftItems = await Promise.all(
            response.data.nftItems.map(async (item: NFTItem) => {
              let imageUrl = "";
              try {
                if (item.tokenURI) {
                  const tokenData = await fetch(item.tokenURI).then((res) => res.json());
                  imageUrl = tokenData.image; // Extract image from tokenURI JSON
                }
              } catch (err) {
                console.error("Failed to fetch token URI:", err);
              }

              return {
                ...item,
                image: imageUrl, // Add image field
              };
            })
          );

          setResult({
            ...response.data,
            nftItems: updatedNftItems,
          });
        } else {
          setResult(response.data);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch balance. Please try again.');
      setResult(null);
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
        <h2 className="text-3xl sm:text-4xl text-white mb-4">Check Token Balance</h2>
        <p className="text-gray-400">View token balances across different standards</p>
        
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl text-white">Balance Checker</h3>
          </div>

          <form onSubmit={handleCheckBalance} className="space-y-6">
            {/* Token Type Selector */}
            <TokenTypeTabs
              tokenType={tokenType}
              onTokenTypeChange={handleTokenTypeChange}
              accentColor="cyan"
            />

            {/* Wallet Address */}
            <FormInput
              label="Wallet Address"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              accentColor="cyan"
            />

            {/* Contract Address */}
            <FormInput
              label="Contract Address"
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x..."
              accentColor="cyan"
            />

            {/* Demo Values Button */}
            <AnimatedButton
              type="button"
              onClick={handleUseDemoValues}
              variant="secondary"
              fullWidth
            >
              Use Demo Values
            </AnimatedButton>

            {/* Submit Button */}
            <AnimatedButton
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check Balance
                </>
              )}
            </AnimatedButton>
          </form>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
          <h3 className="text-2xl text-white mb-6">Balance Result</h3>

          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Balance Display */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6 text-center">
                <div className="text-sm text-gray-400 mb-2">Total Balance</div>
                <div className="text-4xl text-white mb-2">
                  {tokenType === 'ERC20' 
                    ? (result as ERC20BalanceResponse).balance 
                    : (result as NFTBalanceResponse).totalTokens}
                </div>
                <div className="text-cyan-400">
                  {tokenType === 'ERC20' 
                    ? (result as ERC20BalanceResponse).tokenSymbol 
                    : (result as NFTBalanceResponse).tokenSymbol}
                </div>
              </div>

              {/* Token Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Token Name</span>
                  <span className="text-white">
                    {tokenType === 'ERC20' 
                      ? (result as ERC20BalanceResponse).tokenName 
                      : (result as NFTBalanceResponse).tokenName}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Symbol</span>
                  <span className="text-white">
                    {tokenType === 'ERC20' 
                      ? (result as ERC20BalanceResponse).tokenSymbol 
                      : (result as NFTBalanceResponse).tokenSymbol}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Standard</span>
                  <span className="text-cyan-400">{tokenType}</span>
                </div>
              </div>

              {/* NFT Items for ERC721 and ERC1155 */}
              {tokenType !== 'ERC20' && (result as NFTBalanceResponse).nftItems && (result as NFTBalanceResponse).nftItems!.length > 0 && (
                <div>
                  <div className="text-sm text-gray-400 mb-3">NFT Items</div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {(result as NFTBalanceResponse).nftItems!.map((item, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                        <div className="flex gap-4">
                          {/* NFT Image */}
                          {item.image && (
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800">
                              <img 
                                src={item.image} 
                                alt={`Token #${item.tokenId}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23334155" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23cbd5e1" font-size="24"%3E%23${item.tokenId}%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            </div>
                          )}
                          
                          {/* NFT Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white">Token ID: #{item.tokenId}</span>
                              {item.amount && (
                                <span className="text-gray-400 text-sm">Qty: {item.amount}</span>
                              )}
                            </div>
                            {item.tokenURI && (
                              <div className="text-xs text-gray-500 break-all line-clamp-2" title={item.tokenURI}>
                                {item.tokenURI}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View on Etherscan */}
              <div className="w-full">
                <EtherscanLink
                  address={contractAddress}
                  type="address"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
                />
              </div>

              {/* Copy Address */}
              <AnimatedButton
                onClick={() => copyToClipboard(contractAddress)}
                className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Contract Address
                  </>
                )}
              </AnimatedButton>
            </motion.div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-4xl">❌</span>
              </div>
              <p className="text-red-400 mb-2">Error</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400">Enter addresses and check balance to see results</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}