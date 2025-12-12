import { CheckCircle, ExternalLink, Flame, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';
import type {
  BurnERC1155Request,
  BurnERC20Request,
  BurnERC721Request,
  BurnResponse,
  ERC20BalanceResponse,
  NFTBalanceResponse,
  NFTItem,
} from '../config/api';
import { API_ROUTES, apiClient } from '../config/api';
import { demoBurnInputs } from '../config/demoData';
import { ENV } from '../config/env';
import { validateEthereumAddressWithToast } from '../utils/validation';

export function BurnToken() {
  const [tokenType, setTokenType] = useState<'ERC20' | 'ERC721' | 'ERC1155'>('ERC20');
  const [mode, setMode] = useState<'manual' | 'fetch'>('manual'); // Toggle mode
  const [contractAddress, setContractAddress] = useState('');
  const [walletAddress, setWalletAddress] = useState(''); // For fetch mode
  const [nftItems, setNftItems] = useState<(NFTItem & { image?: string })[]>([]); // Fetched NFTs
  const [selectedTokenId, setSelectedTokenId] = useState('');
  const [amount, setAmount] = useState(''); // For ERC20 and ERC1155
  const [result, setResult] = useState<BurnResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingNFTs, setFetchingNFTs] = useState(false);
  
  // ERC20 Balance state
  const [erc20Balance, setErc20Balance] = useState<ERC20BalanceResponse | null>(null);
  const [fetchingBalance, setFetchingBalance] = useState(false);

  const handleUseDemoValues = () => {
    const demoData = demoBurnInputs[tokenType];
    
    setContractAddress(demoData.contractAddress);
    
    if (tokenType === 'ERC20' && 'amount' in demoData) {
      setAmount(demoData.amount);
      // Reset balance when using demo values
      setErc20Balance(null);
    } else if (tokenType === 'ERC721' && 'tokenId' in demoData) {
      // Only set tokenId in manual mode, in fetch mode user must select from list
      if (mode === 'manual') {
        setSelectedTokenId(demoData.tokenId);
      }
      // Set wallet address only in fetch mode
      if (mode === 'fetch') {
        setWalletAddress(ENV.DEPLOYER_WALLET_ADDRESS);
      }
    } else if (tokenType === 'ERC1155' && 'tokenId' in demoData && 'amount' in demoData) {
      // Only set tokenId in manual mode, in fetch mode user must select from list
      if (mode === 'manual') {
        setSelectedTokenId(demoData.tokenId);
        setAmount(demoData.amount);
      }
      // Set wallet address only in fetch mode
      if (mode === 'fetch') {
        setWalletAddress(ENV.DEPLOYER_WALLET_ADDRESS);
      }
    }
  };

  const handleTokenTypeChange = (type: 'ERC20' | 'ERC721' | 'ERC1155') => {
    setTokenType(type);
    setResult(null);
    setContractAddress('');
    setWalletAddress('');
    setAmount('');
    setSelectedTokenId('');
    setErc20Balance(null);
    setNftItems([]);
  };

  const handleAddressBlur = (address: string, fieldName: string) => {
    // Only validate if address is not empty
    if (address.trim()) {
      validateEthereumAddressWithToast(address, fieldName);
    }
  };

  const handleFetchERC20Balance = async () => {
    if (!contractAddress.trim()) {
      toast.error('Please enter a contract address');
      return;
    }
    
    // Validate contract address
    if (!validateEthereumAddressWithToast(contractAddress, 'contract address')) {
      return;
    }
    
    setFetchingBalance(true);
    
    try {
      const params = {
        contractAddress,
        walletAddress: ENV.DEPLOYER_WALLET_ADDRESS, // Use deployer wallet for burning
      };

      const response = await apiClient.get<ERC20BalanceResponse>(API_ROUTES.balance.erc20, { params });
      
      setErc20Balance(response.data);
      toast.success(`Balance loaded: ${response.data.balance} ${response.data.tokenSymbol}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch balance. Please try again.');
      console.error('Fetching balance error:', err);
      setErc20Balance(null);
    } finally {
      setFetchingBalance(false);
    }
  };

  const handleFetchNFTs = async () => {
    if (!contractAddress.trim() || !walletAddress.trim()) {
      toast.error('Please enter both contract address and wallet address');
      return;
    }
    
    // Validate contract address
    if (!validateEthereumAddressWithToast(contractAddress, 'contract address')) {
      return;
    }
    
    // Validate wallet address
    if (!validateEthereumAddressWithToast(walletAddress, 'wallet address')) {
      return;
    }
    
    setFetchingNFTs(true);
    
    try {
      const params = {
        contractAddress,
        walletAddress,
      };

      let response: { data: NFTBalanceResponse };
      
      if (tokenType === 'ERC721') {
        response = await apiClient.get<NFTBalanceResponse>(API_ROUTES.balance.erc721, { params });
      } else {
        // ERC1155
        response = await apiClient.get<NFTBalanceResponse>(API_ROUTES.balance.erc1155, { params });
      }

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
              image: imageUrl || '🎨', // Fallback to emoji if image fetch fails
            };
          })
        );

        setNftItems(updatedNftItems);
        toast.success(`Found ${updatedNftItems.length} NFT(s) in your wallet!`);
      } else {
        setNftItems([]);
        toast.info('No NFTs found in this wallet for this contract');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch NFTs. Please try again.');
      console.error('Fetching NFTs error:', err);
    } finally {
      setFetchingNFTs(false);
    }
  };

  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate contract address
    if (!validateEthereumAddressWithToast(contractAddress, 'contract address')) {
      return;
    }
    
    if (tokenType === 'ERC20') {
      // Must fetch balance for ERC20
      if (!erc20Balance) {
        toast.error('Please fetch token balance first by clicking "Fetch Token Balance"');
        return;
      }
      
      if (!amount || parseInt(amount) < 1) {
        toast.error('Please enter a valid amount (minimum 1)');
        return;
      }
      
      // Validate against fetched balance
      const burnAmount = parseInt(amount);
      const availableBalance = parseInt(erc20Balance.balance);
      
      if (burnAmount > availableBalance) {
        toast.error(`Insufficient balance. You have ${availableBalance} ${erc20Balance.tokenSymbol} available.`);
        return;
      }
    } else {
      // ERC721 and ERC1155
      
      // In fetch mode, validate wallet address
      if (mode === 'fetch' && !validateEthereumAddressWithToast(walletAddress, 'wallet address')) {
        return;
      }
      
      // In fetch mode, must fetch NFTs first
      if (mode === 'fetch' && nftItems.length === 0) {
        toast.error('Please fetch your NFTs first by clicking the refresh button');
        return;
      }
      
      if (!selectedTokenId) {
        toast.error('Please select a token to burn');
        return;
      }
      if (tokenType === 'ERC1155' && (!amount || parseInt(amount) < 1)) {
        toast.error('Please enter a valid amount (minimum 1)');
        return;
      }
      
      // Validate against fetched NFT balance for ERC1155
      if (tokenType === 'ERC1155' && mode === 'fetch' && nftItems.length > 0) {
        const selectedNFT = nftItems.find(t => t.tokenId === selectedTokenId);
        if (selectedNFT && selectedNFT.amount) {
          const burnAmount = parseInt(amount);
          const availableAmount = parseInt(selectedNFT.amount);
          
          if (burnAmount > availableAmount) {
            toast.error(`Insufficient balance. You have ${availableAmount} tokens available for Token #${selectedTokenId}.`);
            return;
          }
        }
      }
    }
    
    setLoading(true);
    
    try {
      let response;
      
      if (tokenType === 'ERC20') {
        const requestData: BurnERC20Request = {
          contractAddress,
          amount,
        };
        response = await apiClient.post(API_ROUTES.burn.erc20, requestData);
        toast.success('ERC20 tokens burned successfully!');
      } else if (tokenType === 'ERC721') {
        const requestData: BurnERC721Request = {
          contractAddress,
          tokenId: selectedTokenId,
        };
        console.log('🔥 ERC721 Burn Request Data:', requestData);
        console.log('🔥 Mode:', mode);
        console.log('🔥 Selected Token ID Type:', typeof selectedTokenId);
        console.log('🔥 Wallet Address (fetch mode only):', walletAddress);
        console.log('🔥 Mode:', mode);
        console.log('🔥 Selected Token ID Type:', typeof selectedTokenId);
        console.log('🔥 Wallet Address (fetch mode only):', walletAddress);
        response = await apiClient.post(API_ROUTES.burn.erc721, requestData);
        toast.success('ERC721 NFT burned successfully!');
        
        // Remove burned token from list
        setNftItems(nftItems.filter(t => t.tokenId !== selectedTokenId));
        setSelectedTokenId('');
      } else {
        const requestData: BurnERC1155Request = {
          contractAddress,
          tokenId: selectedTokenId,
          amount,
        };
        console.log('🔥 ERC1155 Burn Request Data:', requestData);
        response = await apiClient.post(API_ROUTES.burn.erc1155, requestData);
        toast.success('ERC1155 tokens burned successfully!');
      }
      
      setResult(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to burn token. Please try again.');
      console.error('Burning error:', err);
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
        <h2 className="text-3xl sm:text-4xl text-white mb-4">Burn Token</h2>
        <p className="text-gray-400">Permanently remove tokens from circulation</p>
        
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl text-white">Burn Tokens</h3>
          </div>

          <form onSubmit={handleBurn} className="space-y-6">
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
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            {/* Fetch Balance Button for ERC20 */}
            {tokenType === 'ERC20' && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFetchERC20Balance}
                disabled={!contractAddress || fetchingBalance}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {fetchingBalance ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Fetching Balance...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Fetch Token Balance
                  </>
                )}
              </motion.button>
            )}

            {/* ERC20 Balance Display */}
            {tokenType === 'ERC20' && erc20Balance && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Available Balance</div>
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl text-white mb-1">
                  {erc20Balance.balance} {erc20Balance.tokenSymbol}
                </div>
                <div className="text-sm text-gray-400">
                  {erc20Balance.tokenName}
                </div>
              </motion.div>
            )}

            {/* Mode Toggle for ERC721 and ERC1155 */}
            {(tokenType === 'ERC721' || tokenType === 'ERC1155') && (
              <div>
                <label className="block text-sm text-gray-400 mb-3">Input Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setMode('manual');
                      setNftItems([]);
                      setSelectedTokenId('');
                    }}
                    className={`py-3 rounded-lg transition-all ${
                      mode === 'manual'
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    Manual Entry
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setMode('fetch');
                      setNftItems([]);
                      setSelectedTokenId('');
                    }}
                    className={`py-3 rounded-lg transition-all ${
                      mode === 'fetch'
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    Fetch from Wallet
                  </motion.button>
                </div>
              </div>
            )}

            {/* Wallet Address (for fetch mode only) */}
            {(tokenType === 'ERC721' || tokenType === 'ERC1155') && mode === 'fetch' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            )}

            {/* Fetch NFTs Button for ERC721 and ERC1155 (for fetch mode only) */}
            {(tokenType === 'ERC721' || tokenType === 'ERC1155') && mode === 'fetch' && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFetchNFTs}
                disabled={!contractAddress || !walletAddress || fetchingNFTs}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {fetchingNFTs ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Fetching NFTs...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Fetch Your NFTs
                  </>
                )}
              </motion.button>
            )}

            {/* Manual Token ID Input (for manual mode only) */}
            {(tokenType === 'ERC721' || tokenType === 'ERC1155') && mode === 'manual' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Token ID</label>
                <input
                  type="text"
                  value={selectedTokenId}
                  onChange={(e) => setSelectedTokenId(e.target.value)}
                  placeholder="Enter token ID"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            )}

            {/* Amount (for ERC20 and ERC1155) */}
            {tokenType === 'ERC20' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            )}

            {/* Amount for ERC1155 in manual mode only */}
            {tokenType === 'ERC1155' && mode === 'manual' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            )}

            {/* Token ID Selector (for fetch mode when NFTs are loaded) */}
            {(tokenType === 'ERC721' || tokenType === 'ERC1155') && mode === 'fetch' && nftItems.length > 0 && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Select Token to Burn</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {nftItems.map((token) => (
                    <motion.div
                      key={token.tokenId}
                      onClick={() => setSelectedTokenId(token.tokenId)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedTokenId === token.tokenId
                          ? 'bg-gradient-to-r from-orange-500/20 to-red-600/20 border border-orange-500/50'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {token.image && token.image.startsWith('http') ? (
                          <img src={token.image} alt={`Token ${token.tokenId}`} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="text-3xl">{token.image || '🎨'}</div>
                        )}
                        <div className="flex-1">
                          <div className="text-white">Token #{token.tokenId}</div>
                          <div className="text-sm text-gray-400">
                            {tokenType === 'ERC1155' && token.amount && `Amount: ${token.amount}`}
                          </div>
                        </div>
                        {selectedTokenId === token.tokenId && (
                          <CheckCircle className="w-5 h-5 text-orange-400" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Amount for ERC1155 in fetch mode - show after selecting a token */}
            {tokenType === 'ERC1155' && mode === 'fetch' && nftItems.length > 0 && selectedTokenId && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount to Burn</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {nftItems.find(t => t.tokenId === selectedTokenId)?.amount || 0}
                </p>
              </div>
            )}

            {/* Warning Box */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-400">
                <strong>⚠️ Warning:</strong> Burning tokens is permanent and cannot be undone. Make sure you want to proceed.
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
              Use Demo Contract
            </motion.button>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={loading || (tokenType !== 'ERC20' && !selectedTokenId) ? {} : loading ? {} : { scale: 1.02 }}
              whileTap={loading || (tokenType !== 'ERC20' && !selectedTokenId) ? {} : loading ? {} : { scale: 0.98 }}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Burning...
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5" />
                  Burn Token
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
          <h3 className="text-2xl text-white mb-6">Burn Result</h3>

          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Success Message */}
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <div className="text-xl text-white mb-2">Token Burned Successfully!</div>
                <div className="text-sm text-gray-400">The token has been removed from circulation</div>
              </div>

              {/* Burn Details */}
              <div className="space-y-4">
                {result.tokenId && (
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Burned Token ID</div>
                    <div className="text-white">#{result.tokenId}</div>
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

                {result.contractAddress && (
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Contract Address</div>
                    <div className="text-white break-all font-mono text-sm">{result.contractAddress}</div>
                  </div>
                )}

                {/* Deployer Wallet Address */}
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Deployer Wallet</div>
                  <div className="text-white break-all font-mono text-sm">{ENV.DEPLOYER_WALLET_ADDRESS}</div>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href={`${ENV.ETHERSCAN_BASE_URL}${ENV.DEPLOYER_WALLET_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-cyan-400 text-sm flex items-center gap-1 hover:text-cyan-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Etherscan
                  </motion.a>
                </div>

                {result.amount && (
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Amount Burned</span>
                    <span className="text-white">{result.amount}</span>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Confirmed
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Flame className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400">Select a token and burn to see results</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}