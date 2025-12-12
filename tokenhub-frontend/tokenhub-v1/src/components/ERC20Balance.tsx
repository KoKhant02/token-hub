import { useState } from "react";
import api from "../api/tokenhub";

type TokenInfo = {
  tokenName: string;
  tokenSymbol: string;
  address: string;
  balance: string;
};

function ERC20Balance() {
  const [walletAddress, setWalletAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    try {
      setError(null);
      setTokenInfo(null);
      setLoading(true);

      const response = await api.get("/balance/erc20", {
        params: {
          walletAddress,
          contractAddress,
        },
      });

      setTokenInfo(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch balance. Please check the addresses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow rounded-4 p-4">
            <h3 className="mb-4">ERC20 Balance Checker</h3>

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
                "Check Balance"
              )}
            </button>

            {tokenInfo && (
              <div className="alert alert-success mt-4 text-start" role="alert">
                <div className="mb-2">
                  <strong className="d-inline">Name:</strong>
                  <span className="ms-2">{tokenInfo.tokenName}</span>
                </div>
                <div className="mb-2">
                  <strong className="d-inline">Symbol:</strong>
                  <span className="ms-2">{tokenInfo.tokenSymbol}</span>
                </div>
                <div className="mb-2">
                  <strong className="d-inline">Token Address:</strong>
                  <span className="ms-2 text-break">{tokenInfo.address}</span>
                </div>
                <div className="mb-0">
                  <strong className="d-inline">Balance:</strong>
                  <span className="ms-2">{tokenInfo.balance}</span>
                </div>
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

export default ERC20Balance;
