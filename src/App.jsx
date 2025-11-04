
import React, { useState } from "react";

const contracts = [
  { name: "SimpleStorage", description: "Przechowuje liczbę, którą możesz ustawić i odczytać." },
  { name: "MessageBoard", description: "Tablica wiadomości – każdy może zapisać i odczytać ostatnią wiadomość oraz nadawcę." },
  { name: "ClickCounter", description: "Licznik kliknięć – każdy może zwiększać licznik globalny." },
  { name: "SimpleVoting", description: "Głosowanie – każdy może zagłosować na opcję A lub B." }
];

function App() {
  // headerWords usunięte, bo nie jest już używane
  const [showHeader, setShowHeader] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showButton, setShowButton] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowHeader(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (showHeader) {
      const timerWelcome = setTimeout(() => setShowWelcome(true), 2500);
      const timerButton = setTimeout(() => setShowButton(true), 5500);
      return () => {
        clearTimeout(timerWelcome);
        clearTimeout(timerButton);
      };
    } else {
      setShowWelcome(false);
      setShowButton(false);
    }
  }, [showHeader]);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask required");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        setIsWalletConnected(true);
        setWalletAddress(accounts[0]);
      } else {
        setIsWalletConnected(false);
        setWalletAddress("");
      }
    } catch (error) {
      alert("Failed to connect wallet: " + error.message);
      setIsWalletConnected(false);
      setWalletAddress("");
    }
  }

  return (
    <div className="App">
  <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px', padding: '18px 40px', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, background: '#2563eb' }}>
        <span className="header-title" style={{ color: '#fff', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 700, fontSize: '1.8em', letterSpacing: '0.01em', opacity: showHeader ? 1 : 0, transition: 'opacity 5s' }}>
          Deploy Your Contract on
        </span>
        <select
          style={{ fontSize: '1em', padding: '6px 16px', borderRadius: 8, border: '1px solid #bbb', outline: 'none', fontWeight: 500, opacity: showHeader ? 1 : 0, transition: 'opacity 5s' }}
          onChange={async (e) => {
            const chain = e.target.value;
            let chainParams = null;
            if (chain === 'celo') {
              chainParams = {
                chainId: '0xa4ec', // 42220
                chainName: 'Celo Mainnet',
                nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
                rpcUrls: ['https://forno.celo.org'],
                blockExplorerUrls: ['https://explorer.celo.org']
              };
            } else if (chain === 'base') {
              chainParams = {
                chainId: '0x2105', // 8451
                chainName: 'Base Mainnet',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org']
              };
            } else if (chain === 'optimism') {
              chainParams = {
                chainId: '0xa', // 10
                chainName: 'Optimism',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://mainnet.optimism.io'],
                blockExplorerUrls: ['https://optimistic.etherscan.io']
              };
            }
            if (window.ethereum && chainParams) {
              try {
                await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [chainParams] });
              } catch (err) {
                // user rejected or already on chain
              }
            }
          }}
        >
          <option value="celo">Celo</option>
          <option value="base">Base</option>
          <option value="optimism">Optimism</option>
        </select>
      </div>
      <div style={{ padding: 40, paddingTop: 120 }}>
        {!isWalletConnected ? (
          <>
            <div
              style={{
                maxWidth: 540,
                margin: '0px auto 32px auto',
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 12,
                boxShadow: '0 2px 16px rgba(0,82,255,0.08)',
                padding: '28px 32px',
                textAlign: 'center',
                fontFamily: 'Inter, Arial, sans-serif',
                fontWeight: 500,
                fontSize: '1.12em',
                letterSpacing: '0.01em',
                opacity: showWelcome ? 1 : 0,
                transform: showWelcome ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 5s, transform 5s'
              }}
            >
              <span style={{ color: '#2563eb', fontWeight: 700 }}>
                <span style={{ fontSize: '1.08em', fontWeight: 700, display: 'block', marginBottom: '32px' }}>
                  Deploy Your Contract – Fast & Secure!
                </span>
                Welcome to panel for deploying smart contracts on Celo or Base blockchain.<br />
                Connect wallet, choose a network, and deploy ready-to-use contracts with a single click!<br /><br />
                Click “Connect Wallet” and start deploying your own contracts in seconds!
              </span>
              <span style={{ fontSize: '0.74em', fontStyle: 'italic', color: '#888', marginTop: 28, display: 'block', fontFamily: 'Georgia, Times, Times New Roman, serif' }}>
                Currently 4 contracts available. More coming soon.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px', marginBottom: '18px' }}>
              <button
                className="ibb-btn"
                style={{
                  opacity: showButton ? 1 : 0,
                  transition: 'opacity 5s'
                }}
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            </div>
          </>
        ) : (
          <div>
            <div style={{ marginBottom: 20 }}>Połączono: {walletAddress}</div>
            <button
              className="ibb-btn"
              style={{ marginBottom: '10px' }}
              onClick={() => { setIsWalletConnected(false); setWalletAddress(""); }}
            >
              Disconnect
            </button>
            <div style={{ marginTop: 30 }}>
              {contracts.map((contract, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                  <button
                    className="ibb-btn"
                    style={{ marginRight: '18px', minWidth: '140px' }}
                  >
                    {contract.name}
                  </button>
                  <span style={{ color: '#444', fontSize: '1rem' }}>{contract.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;