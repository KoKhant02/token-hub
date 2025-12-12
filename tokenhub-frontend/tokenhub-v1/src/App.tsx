import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ERC1155Balance from './components/ERC1155Balance';
import ERC1155Burner from './components/ERC1155Burnner';
import ERC1155Deployer from './components/ERC1155Deployer';
import ERC1155Minter from './components/ERC1155Minter';
import ERC20Balance from './components/ERC20Balance';
import ERC20Burner from './components/ERC20Burnner';
import ERC20Deployer from './components/ERC20Deployer';
import ERC20Minter from './components/ERC20Minter';
import ERC721Balance from './components/ERC721Balance';
import ERC721Burner from './components/ERC721Burnner';
import ERC721Deployer from './components/ERC721Deployer';
import ERC721Minter from './components/ERC721Minter';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/erc20-balance" element={<ERC20Balance />} />
          <Route path="/erc721-balance" element={<ERC721Balance />} />
          <Route path="/erc1155-balance" element={<ERC1155Balance />} />
          <Route path="/deploy-erc20" element={<ERC20Deployer />} />
          <Route path="/deploy-erc721" element={<ERC721Deployer />} />
          <Route path="/deploy-erc1155" element={<ERC1155Deployer />} />
          <Route path="/mint-erc20" element={<ERC20Minter />} />
          <Route path="/mint-erc721" element={<ERC721Minter />} />
          <Route path="/mint-erc1155" element={<ERC1155Minter />} />
          <Route path="/burn-erc20" element={<ERC20Burner />} />
          <Route path="/burn-erc721" element={<ERC721Burner />} />
          <Route path="/burn-erc1155" element={<ERC1155Burner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
