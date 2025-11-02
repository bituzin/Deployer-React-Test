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
          Deploy your contract <span style={{fontFamily: 'Inter, Arial, sans-serif', fontWeight: 700, fontSize: '1.35rem', color: '#fff', letterSpacing: '0.01em'}}>on</span>
        </span>
        <select
          value={network}
          onChange={e => setNetwork(e.target.value)}
          className="header-select"
        >
          <option value="base">Base</option>
          <option value="celo">Celo</option>
        </select>
      </div>
      <div style={{ padding: 40, paddingTop: 120 }}>
        {!isWalletConnected ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <button
              onClick={connectWallet}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 20 }}>Połączono: {walletAddress}</div>
            <button onClick={() => { setIsWalletConnected(false); setWalletAddress(""); }}>Disconnect</button>
            <div style={{ marginTop: 30 }}>
              {contracts.map((contract, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                  <button style={{
                    padding: '10px 18px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(90deg,#2563eb,#1e40af)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    marginRight: '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    minWidth: '140px',
                    cursor: 'pointer'
                  }}>{contract.name}</button>
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