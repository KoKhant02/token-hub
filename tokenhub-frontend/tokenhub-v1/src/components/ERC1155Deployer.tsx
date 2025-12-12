import { useState } from "react";
import api from "../api/tokenhub";

type DeployNFTResponse = {
  tokenName: string;
  tokenSymbol: string;
  address: string;
};

function ERC1155Deployer() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [response, setResponse] = useState<DeployNFTResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeploy = async () => {
    try {
      setError(null);
      setResponse(null);
      setLoading(true);

      const res = await api.post("/deploy/erc1155", {
        tokenName,
        tokenSymbol,
      });

      setResponse(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data || "Deployment failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow rounded-4 p-4">
            <h3 className="mb-4">ERC1155 Token Deployer</h3>

            <div className="mb-3 text-start">
              <label htmlFor="tokenName" className="form-label">Token Name</label>
              <input
                type="text"
                className="form-control"
                id="tokenName"
                placeholder="My1155Token"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="tokenSymbol" className="form-label">Token Symbol</label>
              <input
                type="text"
                className="form-control"
                id="tokenSymbol"
                placeholder="M1155"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleDeploy}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Deploying...
                </>
              ) : (
                "Deploy Token"
              )}
            </button>

            {response && (
              <div className="alert alert-success mt-4 text-start" role="alert">
                <div className="mb-2">
                  <strong>Name:</strong> <span className="ms-2">{response.tokenName}</span>
                </div>
                <div className="mb-2">
                  <strong>Symbol:</strong> <span className="ms-2">{response.tokenSymbol}</span>
                </div>
                <div className="mb-0">
                  <strong>Contract Address:</strong> <span className="ms-2 text-break">{response.address}</span>
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

export default ERC1155Deployer;
