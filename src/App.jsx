import React, { useState } from "react";

const contracts = [
  { name: "SimpleStorage", description: "Przechowuje liczbę, którą możesz ustawić i odczytać." },
  { name: "MessageBoard", description: "Tablica wiadomości – każdy może zapisać i odczytać ostatnią wiadomość oraz nadawcę." },
  { name: "ClickCounter", description: "Licznik kliknięć – każdy może zwiększać licznik globalny." },
  { name: "SimpleVoting", description: "Głosowanie – każdy może zagłosować na opcję A lub B." }
];

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("base");

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
      <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px 40px', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
        <span className="header-title" style={{ color: '#fff', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 700, fontSize: '1.35rem', letterSpacing: '0.01em' }}>
          Deploy Your Contract <span style={{fontFamily: 'Inter, Arial, sans-serif', fontWeight: 700, fontSize: '1.35rem', color: '#fff', letterSpacing: '0.01em'}}>on</span>
        </span>
        <select
          value={network}
          onChange={async e => {
            const newNetwork = e.target.value;
            setNetwork(newNetwork);
            if (window.ethereum && isWalletConnected) {
              let chainId;
              if (newNetwork === "base") chainId = "0x2105"; // Base Mainnet
              if (newNetwork === "celo") chainId = "0xa4ec"; // Celo Mainnet
              if (chainId) {
                try {
                  await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId }]
                  });
                } catch (err) {
                  alert("Nie udało się przełączyć sieci w portfelu: " + err.message);
                }
              }
            }
          }}
          className="header-select"
        >
          <option value="base">Base</option>
          <option value="celo">Celo</option>
        </select>
      </div>
      <div style={{ padding: 40, paddingTop: 120 }}>
        {!isWalletConnected ? (
          <>
            <div style={{
              maxWidth: 540,
              margin: '40px auto 32px auto',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 12,
              boxShadow: '0 2px 16px rgba(0,82,255,0.08)',
              padding: '28px 32px',
              textAlign: 'center',
              color: '#174ea6',
              fontFamily: 'Inter, Arial, sans-serif',
              fontWeight: 500,
              fontSize: '1.12em',
              letterSpacing: '0.01em'
            }}>
              <div style={{ fontWeight: 700, fontSize: '1.18em', marginBottom: 10, color: '#174ea6' }}>
                Deploy Your Contract – Fast & Secure!
              </div>
              Welcome to panel for deploying smart contracts on Celo or Base blockchain.<br />
              Connect wallet, choose a network, and deploy ready-to-use contracts with a single click!<br /><br />
              <span style={{ color: '#2563eb', fontWeight: 600 }}>Click “Connect Wallet” and start deploying your own contracts in seconds!</span>
              <br />
              <span style={{ fontSize: '0.74em', fontStyle: 'italic', color: '#444', marginTop: 28, display: 'block', fontFamily: 'Georgia, Times, Times New Roman, serif' }}>
                Currently 4 contracts available. More coming soon.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
              <button
                className="ibb-btn pulse-anim"
                style={{
                  fontFamily: 'Inter, Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '1.08em',
                  padding: '0.7em 1.5em',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(90deg, var(--base-blue), var(--base-blue-light))',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(0,82,255,0.08)',
                  transition: 'box-shadow 0.2s, background 0.2s',
                  outline: 'none',
                  cursor: 'pointer'
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
              className="ibb-btn pulse-anim"
              style={{
                fontFamily: 'Inter, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '1.08em',
                padding: '0.7em 1.5em',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(90deg, var(--base-blue), var(--base-blue-light))',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(0,82,255,0.08)',
                transition: 'box-shadow 0.2s, background 0.2s',
                outline: 'none',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
              onClick={() => { setIsWalletConnected(false); setWalletAddress(""); }}
            >
              Disconnect
            </button>
            <div style={{ marginTop: 30 }}>
              {contracts.map((contract, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                  <button
                    className="ibb-btn pulse-anim"
                    style={{
                      marginRight: '18px',
                      minWidth: '140px',
                      fontFamily: 'Inter, Arial, sans-serif',
                      fontWeight: 600,
                      fontSize: '1.08em',
                      padding: '0.7em 1.5em',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(90deg, var(--base-blue), var(--base-blue-light))',
                      color: '#fff',
                      boxShadow: '0 2px 8px rgba(0,82,255,0.08)',
                      transition: 'box-shadow 0.2s, background 0.2s',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
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