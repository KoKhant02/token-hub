import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleButtonClick = (route: string) => {
    navigate(route);
  };

  const sections = [
    {
      title: "Balance Check",
      items: [
        { title: "NFT (ERC721)", icon: "bi-file-earmark-zip-fill", color: "#007bff", route: "/erc721-balance" },
        { title: "Token (ERC20)", icon: "bi-currency-dollar", color: "#28a745", route: "/erc20-balance" },
        { title: "ERC1155", icon: "bi-stack", color: "#ff7f50", route: "/erc1155-balance" },
      ],
    },
    {
      title: "Deploy Tokens",
      items: [
        { title: "NFT (ERC721)", icon: "bi-file-earmark-zip-fill", color: "#007bff", route: "/deploy-erc721" },
        { title: "Token (ERC20)", icon: "bi-currency-dollar", color: "#28a745", route: "/deploy-erc20" },
        { title: "ERC1155", icon: "bi-stack", color: "#ff7f50", route: "/deploy-erc1155" },
      ],
    },
    {
      title: "Mint Tokens",
      items: [
        { title: "NFT (ERC721)", icon: "bi-file-earmark-zip-fill", color: "#007bff", route: "/mint-erc721" },
        { title: "Token (ERC20)", icon: "bi-currency-dollar", color: "#28a745", route: "/mint-erc20" },
        { title: "ERC1155", icon: "bi-stack", color: "#ff7f50", route: "/mint-erc1155" },
      ],
    },
    {
      title: "Burn Tokens",
      items: [
        { title: "NFT (ERC721)", icon: "bi-file-earmark-zip-fill", color: "#007bff", route: "/burn-erc721" },
        { title: "Token (ERC20)", icon: "bi-currency-dollar", color: "#28a745", route: "/burn-erc20" },
        { title: "ERC1155", icon: "bi-stack", color: "#ff7f50", route: "/burn-erc1155" },
      ],
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-start">Welcome to TokenHub</h2>

      {sections.map((section, i) => (
        <div key={i} className="mb-5">
          <h3 className="text-start mb-4" style={{ fontSize: '1.5rem', fontWeight: '500' }}>
            <i className="bi bi-box-seam-fill me-2" />{section.title}
          </h3>
          <div className="row">
            {section.items.map((item, j) => (
              <div key={j} className="col-md-4 mb-4">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-body text-center">
                    <i className={`bi ${item.icon}`} style={{ fontSize: '2rem', color: item.color }}></i>
                    <h5 className="card-title mt-3">{item.title}</h5>
                    <button
                      onClick={() => handleButtonClick(item.route)}
                      className="btn btn-outline-primary w-100 mt-3"
                    >
                      {section.title.startsWith("Balance") ? "Check Now!" :
                        section.title.startsWith("Deploy") ? "Deploy Now!" :
                          section.title.startsWith("Mint") ? "Mint Now!" : "Burn Now!"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {i < sections.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
}

export default HomePage;
