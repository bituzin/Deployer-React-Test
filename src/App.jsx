
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import { deploySimpleStorageBase } from "./deploySimpleStorageBase";

const contracts = [
  { name: "SimpleStorage", description: "Przechowuje liczbę, którą możesz ustawić i odczytać." },
  { name: "MessageBoard", description: "Tablica wiadomości – każdy może zapisać i odczytać ostatnią wiadomość oraz nadawcę." },
  { name: "ClickCounter", description: "Licznik kliknięć – każdy może zwiększać licznik globalny." },
  { name: "SimpleVoting", description: "Głosowanie – każdy może zagłosować na opcję A lub B." }
];

function App() {
  // Usunięto view, routing przez react-router-dom
  // headerWords usunięte, bo nie jest już używane
  const [showHeader, setShowHeader] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  // const [showButton, setShowButton] = useState(false); // usunięto, bo nieużywane

  React.useEffect(() => {
    const timer = setTimeout(() => setShowHeader(true), 500); // header: 0.5s
    return () => clearTimeout(timer);
  }, []);

  const [showNav, setShowNav] = useState(false);
  React.useEffect(() => {
    if (showHeader) {
      const timerNav = setTimeout(() => setShowNav(true), 500); // pasek: 0.5s po headerze
      const timerWelcome = setTimeout(() => setShowWelcome(true), 1000); // okno: 0.5s po pasku
      return () => {
        clearTimeout(timerNav);
        clearTimeout(timerWelcome);
      };
    } else {
      setShowNav(false);
      setShowWelcome(false);
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
  <Router basename="/">
      <div className="App">
        <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px', padding: '18px 40px', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, background: 'linear-gradient(90deg, #0052FF 0%, #3D7FFF 100%)' }}>
          <span className="header-title" style={{ color: '#fff', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 700, fontSize: '1.8em', letterSpacing: '0.01em', opacity: showHeader ? 1 : 0, transition: 'opacity 1s' }}>
            Contract Deployer
            </span>
          </div>
          <div style={{
            width: '100%',
            position: 'fixed',
            top: 68,
            left: 0,
            zIndex: 999,
            background: '#f5f7fa',
            borderBottom: '1px solid #e3eaf5',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            padding: '5px 28px',
            fontFamily: 'Inter, Arial, sans-serif',
            fontWeight: 500,
            fontSize: '0.98em',
            color: '#2563eb',
            boxShadow: '0 2px 8px rgba(0,82,255,0.04)',
            opacity: showNav ? 1 : 0,
            transform: showNav ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s, transform 1s',
            pointerEvents: showNav ? 'auto' : 'none',
          }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#2563eb', padding: '4px 20px', borderRadius: 6, transition: 'background 0.2s', margin: '0 14px' }}>Home</Link>
            <span style={{ borderLeft: '2px solid #2563eb', height: 28, margin: '0 18px', display: 'inline-block', verticalAlign: 'middle' }}></span>
            <Link to="/deploy" style={{ textDecoration: 'none', color: '#2563eb', padding: '4px 20px', borderRadius: 6, transition: 'background 0.2s', margin: '0 14px' }}>Deploy</Link>
            <span style={{ borderLeft: '2px solid #2563eb', height: 28, margin: '0 18px', display: 'inline-block', verticalAlign: 'middle' }}></span>
            <div style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={e => {
                const menu = e.currentTarget.querySelector('.contracts-dropdown');
                if (menu) menu.style.display = 'block';
              }}
              onMouseLeave={e => {
                const menu = e.currentTarget.querySelector('.contracts-dropdown');
                if (menu) menu.style.display = 'none';
              }}
            >
              <span style={{ textDecoration: 'none', color: '#2563eb', padding: '4px 20px', borderRadius: 6, transition: 'background 0.2s', margin: '0 14px', cursor: 'pointer' }}>Contracts</span>
              <span style={{ borderLeft: '2px solid #2563eb', height: 28, margin: '0 18px', display: 'inline-block', verticalAlign: 'middle' }}></span>
              <div className="contracts-dropdown" style={{
                display: 'none',
                position: 'absolute',
                top: '100%',
                left: 0,
                background: '#fff',
                minWidth: '180px',
                boxShadow: '0 4px 16px rgba(0,82,255,0.10)',
                borderRadius: '8px',
                zIndex: 1001,
                padding: '8px 0',
                fontSize: '1em',
                fontFamily: 'Inter, Arial, sans-serif',
                fontWeight: 500
              }}>
                {contracts.map((contract) => (
                  <span
                    key={contract.name}
                    style={{
                      display: 'block',
                      padding: '8px 20px',
                      color: '#2563eb',
                      textDecoration: 'none',
                      borderRadius: 0,
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseOver={e => e.currentTarget.style.background='#e3eaf5'}
                    onMouseOut={e => e.currentTarget.style.background='transparent'}
                  >
                    {contract.name}
                  </span>
                ))}
              </div>
            </div>
            <Link to="/how" style={{ textDecoration: 'none', color: '#2563eb', padding: '4px 20px', borderRadius: 6, transition: 'background 0.2s', margin: '0 14px' }}>How It Works</Link>
          </div>
          <div style={{ padding: 40, paddingTop: 120 }}>
            <Routes>
              <Route path="/" element={
                <>
                  {/* Okno powitalne z fade-in tylko na Home */}
                  <div
                    style={{
                      maxWidth: 540,
                      margin: '60px auto 32px auto',
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
                      transition: 'opacity 1s, transform 1s'
                    }}
                  >
                    <span style={{ color: '#2563eb', fontWeight: 700 }}>
                      <span style={{ fontSize: '1.08em', fontWeight: 700, display: 'block', marginBottom: '32px' }}>
                        Deploy Your Contract – Fast & Secure!
                      </span>
                      Welcome to panel for deploying smart contracts on Celo, Base and Optimism blockchain.<br />
                      <br />
                      Click "Deploy", connect wallet, choose a network, and deploy ready-to-use contracts with a single click!<br />
                      <br />
                      Deploy your own contracts in seconds!
                    </span>
                    <span style={{ fontSize: '0.74em', fontStyle: 'italic', color: '#888', marginTop: 28, display: 'block', fontFamily: 'Georgia, Times, Times New Roman, serif' }}>
                      Currently 4 contracts available. More coming soon.
                    </span>
                  </div>
                </>
              } />
              <Route path="/deploy" element={
                <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {!isWalletConnected ? (
                    <>
                      <div style={{ fontWeight: 600, fontSize: '1.08em', marginBottom: 18, color: '#2563eb', textAlign: 'center' }}>
                        Connect Your Wallet First
                      </div>
                      <button
                        className="ibb-btn"
                        style={{ minWidth: '120px', fontSize: '0.98em', padding: '0.5em 1.1em', marginTop: '18px' }}
                        onClick={connectWallet}
                      >
                        Connect
                      </button>
                      
                    </>
                  ) : (
                    contracts.map((contract) => (
                      <div key={contract.name} style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                        <button
                          className="ibb-btn"
                          style={{ marginRight: '18px', minWidth: '100px', fontSize: '0.98em', padding: '0.5em 1.1em' }}
                          onClick={async () => {
                            if (contract.name === "SimpleStorage") {
                              if (!window.ethereum) {
                                alert("Potrzebny MetaMask lub inny portfel");
                                return;
                              }
                              try {
                                const provider = new ethers.BrowserProvider(window.ethereum);
                                const signer = await provider.getSigner();
                                // Deploy na Base przez UniversalFactory
                                // Podaj adres UniversalFactory na Base:
                                const UNIVERSAL_FACTORY_ADDRESS = "0xTwójAdresUniversalFactory";
                                const UNIVERSAL_FACTORY_ABI = [
                                  "function deploySimpleStorage() external returns (address)",
                                  "event ContractDeployed(address indexed deployer, address indexed contractAddress, string contractName)"
                                ];
                                const factory = new ethers.Contract(UNIVERSAL_FACTORY_ADDRESS, UNIVERSAL_FACTORY_ABI, signer);
                                const tx = await factory.deploySimpleStorage();
                                const receipt = await tx.wait();
                                const event = receipt.logs
                                  .map(log => {
                                    try {
                                      return factory.interface.parseLog(log);
                                    } catch {
                                      return null;
                                    }
                                  })
                                  .find(e => e && e.name === "ContractDeployed");
                                if (event) {
                                  alert(`Kontrakt SimpleStorage wdrożony na Base!\nAdres: ${event.args.contractAddress}`);
                                } else {
                                  alert("Nie udało się pobrać adresu wdrożonego kontraktu.");
                                }
                              } catch (err) {
                                alert("Błąd deployowania: " + err.message);
                              }
                            } else {
                              alert(`Deploy dla ${contract.name} nie jest jeszcze zaimplementowany.`);
                            }
                          }}
                        >
                          {contract.name}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    );
// Usunięto powielony, stary kod po nowym return
}

export default App;