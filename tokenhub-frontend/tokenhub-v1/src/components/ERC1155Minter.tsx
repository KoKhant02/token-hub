import { useState } from "react";
import api from "../api/tokenhub";

type MintResponse = {
  transactionHash: string;
  status: string;
};

function ERC1155Minter() {
  const [contractAddress, setContractAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [response, setResponse] = useState<MintResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    try {
      setError(null);
      setResponse(null);
      setLoading(true);

      const res = await api.post("/mint/erc1155", {
        contractAddress,
        to: recipient,
        amount,
        tokenURI,
      });

      setResponse(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data || "Minting failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow rounded-4 p-4">
            <h3 className="mb-4">ERC1155 Token Minter</h3>

            <div className="mb-3 text-start">
              <label htmlFor="contractAddress" className="form-label">Contract Address</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                <input
                  type="text"
                  className="form-control"
                  id="contractAddress"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x..."
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="recipient" className="form-label">Recipient Address</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                <input
                  type="text"
                  className="form-control"
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1"
                disabled={loading}
              />
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="tokenURI" className="form-label">Token URI</label>
              <input
                type="text"
                className="form-control"
                id="tokenURI"
                value={tokenURI}
                onChange={(e) => setTokenURI(e.target.value)}
                placeholder="ipfs://..."
                disabled={loading}
              />
            </div>

            <button className="btn btn-primary w-100 mt-3" onClick={handleMint} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Minting...
                </>
              ) : (
                "Mint Token"
              )}
            </button>

            {response && (
              <div className="alert alert-success mt-4 text-start" role="alert">
                <div className="mb-2"><strong>Status:</strong> <span className="ms-2">{response.status}</span></div>
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

            {error && (
              <div className="alert alert-danger mt-3 text-start">{error}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ERC1155Minter;
