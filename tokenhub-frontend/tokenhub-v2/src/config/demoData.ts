import { ENV } from './env';

// Demo values for Balance Check form inputs
export const demoBalanceInputs = {
  ERC20: {
    wallet: '0xD54757c19d677b867cFc6A9bb86152B59e61550A',
    contract: '0xFD3E110D00435de1C0792D885bFE72d0865f5864',
  },
  ERC721: {
    wallet: '0xD54757c19d677b867cFc6A9bb86152B59e61550A',
    contract: '0x2163138FAd4Ad344269FB373359AC43e32967a42',
  },
  ERC1155: {
    wallet: '0xD54757c19d677b867cFc6A9bb86152B59e61550A',
    contract: '0xe762eac66FB748Da41ca1B31448d07D1a15A6D1F',
  }
};

// Demo values for Deploy Token form inputs
export const demoDeployInputs = {
  ERC20: {
    tokenName: 'My ERC20 Token',
    tokenSymbol: 'MTK',
    totalSupply: '1000000',
  },
  ERC721: {
    tokenName: 'My NFT Collection',
    tokenSymbol: 'MNFT',
  },
  ERC1155: {
    tokenName: 'My Multi Token',
    tokenSymbol: 'MULTI',
  }
};

// Demo values for Mint Token form inputs
export const demoMintInputs = {
  ERC20: {
    contractAddress: '0x163F62f7D0F4529f49E4E5F26824279eBC1f7900',
    recipientAddress: ENV.DEPLOYER_WALLET_ADDRESS,
    amount: '10000',
  },
  ERC721: {
    contractAddress: '0x56234F1AD947B4379F75ba63DC5CAD517cDdf8d6',
    tokenURI: 'https://raw.githubusercontent.com/KoKhant02/nft-data/7e506cb7ae15574f69a5c0ce097bf0b2aa1c1ae3/json/Meow/MJ026.json',
  },
  ERC1155: {
    contractAddress: '0xe762eac66FB748Da41ca1B31448d07D1a15A6D1F',
    recipientAddress: ENV.DEPLOYER_WALLET_ADDRESS,
    tokenURI: 'https://raw.githubusercontent.com/KoKhant02/nft-data/7e506cb7ae15574f69a5c0ce097bf0b2aa1c1ae3/json/Meow/MJ026.json',
    amount: '100',
  }
};

// Demo values for Burn Token form inputs
export const demoBurnInputs = {
  ERC20: {
    contractAddress: '0x71E1BE970d7d0C5510080A67b684dca5432b8B15',
    amount: '5000',
  },
  ERC721: {
    contractAddress: '0x56234F1AD947B4379F75ba63DC5CAD517cDdf8d6',
    tokenId: '1',
  },
  ERC1155: {
    contractAddress: '0xe762eac66FB748Da41ca1B31448d07D1a15A6D1F',
    tokenId: '100',
    amount: '10',
  }
};