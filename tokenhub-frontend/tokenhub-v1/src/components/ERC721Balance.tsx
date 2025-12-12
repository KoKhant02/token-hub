import { useState } from "react";
import api from "../api/tokenhub";

type NFTItem = {
  tokenURI: string;
  tokenId: string;
  amount: string;
  image?: string; // Add image field
};

type NFTBalanceResponse = {
  tokenName: string;
  tokenSymbol: string;
  address: string;
  totalTokens: string;
  nftItems: NFTItem[];
};

function ERC721Balance() {
  const [walletAddress, setWalletAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [nftBalance, setNftBalance] = useState<NFTBalanceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    try {
      setError(null);
      setNftBalance(null);
      setLoading(true);

      const response = await api.get("/balance/erc721", {
        params: {
          walletAddress,
          contractAddress,
        },
      });

      // For each NFT item, fetch the image URL from the tokenURI
      const updatedNftItems = await Promise.all(
        response.data.nftItems.map(async (item: NFTItem) => {
          let imageUrl = "";
          try {
            const tokenData = await fetch(item.tokenURI).then((res) => res.json());
            imageUrl = tokenData.image; // Extract image from tokenURI JSON
          } catch (err) {
            console.error("Failed to fetch token URI:", err);
          }

          return {
            ...item,
            image: imageUrl, // Add image field
          };
        })
      );

      setNftBalance({
        ...response.data,
        nftItems: updatedNftItems,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch NFT balance. Please check the addresses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow rounded-4 p-4">
            <h3 className="mb-4">NFT Balance Checker</h3>

            <div className="mb-3 text-start">
              <label htmlFor="walletAddress" className="form-label">
                Wallet Address
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-wallet2"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="walletAddress"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="contractAddress" className="form-label">
                Contract Address
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-file-earmark-lock2"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="contractAddress"
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleCheck}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Checking...
                </>
              ) : (
                "Check NFT Balance"
              )}
            </button>

            {nftBalance && (
              <div className="alert alert-success mt-4 text-start" role="alert">
                <div className="mb-2">
                  <strong className="d-inline">Name:</strong>
                  <span className="ms-2">{nftBalance.tokenName}</span>
                </div>
                <div className="mb-2">
                  <strong className="d-inline">Symbol:</strong>
                  <span className="ms-2">{nftBalance.tokenSymbol}</span>
                </div>
                <div className="mb-2">
                  <strong className="d-inline">Token Address:</strong>
                  <span className="ms-2 text-break">{nftBalance.address}</span>
                </div>
                <div className="mb-2">
                  <strong className="d-inline">Total Tokens:</strong>
                  <span className="ms-2">{nftBalance.totalTokens}</span>
                </div>

                <h5 className="mt-4">NFT Items:</h5>
                {nftBalance && nftBalance.nftItems.length > 0 ? (
  <div className="row">
    {nftBalance.nftItems.map((item, index) => (
      <div key={index} className="col-md-6 mb-4">
        <div className="card p-3 d-flex flex-column" style={{ height: "100%" }}>
          <div><strong>Token ID:</strong> {item.tokenId}</div>
          <div><strong>Amount:</strong> {item.amount}</div>
          <div><strong>Token URI:</strong> <a href={item.tokenURI} target="_blank" rel="noopener noreferrer">View Token</a></div>
          {item.image && (
            <div>
              <strong>Image:</strong>
              <div className="mt-2">
                <img
                  src={item.image}
                  alt={item.tokenId}
                  className="img-fluid"
                  style={{
                    borderRadius: "10px",
                    float: "left",
                    marginRight: "10px",
                    width: "100%",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
) : (
  <div>No NFTs found for this wallet address.</div>
)}

              </div>
            )}

            {error && (
              <div className="alert alert-danger mt-3 text-start" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ERC721Balance;
