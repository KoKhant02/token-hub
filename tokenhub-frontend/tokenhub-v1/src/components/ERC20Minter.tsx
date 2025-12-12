import { useState } from "react";
import api from "../api/tokenhub";

type MintResponse = {
  transactionHash: string;
  status: string;
};

function ERC20Minter() {
  const [contractAddress, setContractAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [response, setResponse] = useState<MintResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    try {
      setError(null);
      setResponse(null);
      setLoading(true);

      const res = await api.post("/mint/erc20", {
        contractAddress,
        to: recipient,
        amount,
      });

      setResponse(res.data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data || "Minting failed. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow rounded-4 p-4">
            <h3 className="mb-4">ERC20 Token Minter</h3>

            {/* Contract Address Input with Icon */}
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

            {/* Recipient Address Input with Icon */}
            <div className="mb-3 text-start">
              <label htmlFor="recipient" className="form-label">
                Recipient Address
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person-badge"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="recipient"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-3 text-start">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input
                type="number"
                className="form-control"
                id="amount"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Mint Button */}
            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleMint}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Minting...
                </>
              ) : (
                "Mint Tokens"
              )}
            </button>

            {response && (
              <div className="alert alert-success mt-4 text-start" role="alert">
                <div className="mb-2">
                  <strong>Status:</strong>
                  <span className="ms-2">{response.status}</span>
                </div>
                <div className="mb-0">
                  <strong>Tx Hash:</strong>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${response.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ms-2 text-break"
                    style={{ fontSize: "0.86rem" }}
                  >
                    {response.transactionHash}
                  </a>
                </div>
              </div>
            )}

            {/* Error */}
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

export default ERC20Minter;
