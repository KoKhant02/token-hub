import { useState } from "react";
import api from "../api/tokenhub";

type BurnResponse = {
  transactionHash: string;
  status: string;
};

function ERC1155Burner() {
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState("");
  const [response, setResponse] = useState<BurnResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBurn = async () => {
    try {
      setError(null);
      setResponse(null);
      setLoading(true);

      const res = await api.post("/burn/erc1155", {
        contractAddress,
        tokenId,
        amount,
      });

      setResponse(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data || "Burning failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow rounded-4 p-4">
            <h3 className="mb-4">ERC1155 Token Burner</h3>

            {/* Contract Address */}
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

            {/* Token ID */}
            <div className="mb-3 text-start">
              <label htmlFor="tokenId" className="form-label">
                Token ID
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-hash"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="tokenId"
                  placeholder="1"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Amount */}
            <div className="mb-3 text-start">
              <label htmlFor="amount" className="form-label">
                Amount to Burn
              </label>
              <input
                type="number"
                className="form-control"
                id="amount"
                placeholder="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Burn Button */}
            <button
              className="btn btn-danger w-100 mt-3"
              onClick={handleBurn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Burning...
                </>
              ) : (
                "Burn Tokens"
              )}
            </button>

            {/* Result */}
            {response && (
              <div className="alert alert-success mt-4 text-start">
                <div className="mb-2">
                  <strong>Status:</strong> <span className="ms-2">{response.status}</span>
                </div>
                <div>
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
              <div className="alert alert-danger mt-3 text-start">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ERC1155Burner;
