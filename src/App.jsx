import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import { deploySimpleStorageBase } from "./deploySimpleStorageBase";

const contracts = [
  { name: "SimpleStorage", description: "Przechowuje liczbę, którą możesz ustawić i odczytać." },
  { name: "ClickCounter", description: "Licznik kliknięć – każdy może zwiększać licznik globalny." },
  { name: "MessageBoard", description: "Tablica wiadomości – każdy może zapisać i odczytać ostatnią wiadomość oraz nadawcę." },
  { name: "SimpleVoting", description: "Głosowanie – każdy może zagłosować na opcję A lub B." }
];

function App() {
  // Usunięto view, routing przez react-router-dom
  // headerWords usunięte, bo nie jest już używane
  const [showHeader, setShowHeader] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  // Popup modal state
  const [popup, setPopup] = useState({ visible: false, message: "", txHash: null });
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
      setPopup({ visible: true, message: "MetaMask required", txHash: null });
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
      setPopup({ visible: true, message: "Failed to connect wallet: " + error.message, txHash: null });
      setIsWalletConnected(false);
      setWalletAddress("");
    }
  }

  return (
    <Router basename="/">
      <div className="App">
        {/* Popup Modal */}
        {popup.visible && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.18)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 14,
              boxShadow: '0 2px 16px rgba(0,82,255,0.12)',
              padding: '32px 38px',
              minWidth: 320,
              maxWidth: 420,
              textAlign: 'center',
              fontFamily: 'Inter, Arial, sans-serif',
              fontWeight: 500,
              fontSize: '1.08em',
              color: '#2563eb',
              position: 'relative',
            }}>
              <div style={{ marginBottom: popup.txHash ? 18 : 28 }}>
                {popup.message}
              </div>
              {popup.txHash && (
                <div style={{ marginBottom: 18 }}>
                  <a
                    href={`https://basescan.org/tx/${popup.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0052FF', textDecoration: 'underline', fontSize: '0.98em' }}
                  >
                    View transaction on explorer
                  </a>
                </div>
              )}
              <button
                className="ibb-btn"
                style={{ minWidth: '120px', fontSize: '0.98em', padding: '0.5em 1.1em', marginTop: '8px' }}
                onClick={() => setPopup({ visible: false, message: "", txHash: null })}
              >
                OK
              </button>
            </div>
          </div>
        )}
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
              <span style={{ textDecoration: 'none', color: '#2563eb', padding: '4px 20px', borderRadius: 6, transition: 'background 0.2s', margin: '0 4px 0 -8px', cursor: 'pointer' }}>Contracts</span>
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
                <Link to="/contract/simple-storage" style={{ display: 'block', padding: '8px 20px', color: '#2563eb', textDecoration: 'none', borderRadius: 0, transition: 'background 0.2s', cursor: 'pointer' }}>SimpleStorage</Link>
                <Link to="/contract/click-counter" style={{ display: 'block', padding: '8px 20px', color: '#2563eb', textDecoration: 'none', borderRadius: 0, transition: 'background 0.2s', cursor: 'pointer' }}>ClickCounter</Link>
                <Link to="/contract/message-board" style={{ display: 'block', padding: '8px 20px', color: '#2563eb', textDecoration: 'none', borderRadius: 0, transition: 'background 0.2s', cursor: 'pointer' }}>MessageBoard</Link>
                <Link to="/contract/simple-voting" style={{ display: 'block', padding: '8px 20px', color: '#2563eb', textDecoration: 'none', borderRadius: 0, transition: 'background 0.2s', cursor: 'pointer' }}>SimpleVoting</Link>
              </div>
            </div>
            <Link to="/how" style={{ textDecoration: 'none', color: '#2563eb', padding: '4px 20px', borderRadius: 6, transition: 'background 0.2s', margin: '0 14px' }}>How It Works</Link>
            <span style={{ borderLeft: '2px solid #2563eb', height: 28, margin: '0 18px', display: 'inline-block', verticalAlign: 'middle' }}></span>
            <Link to="/my-deployments" style={{ textDecoration: 'none', color: '#2563eb', padding: '4px 20px', borderRadius: 6, transition: 'background 0.2s', margin: '0 14px' }}>My Deployments</Link>
            <span style={{ borderLeft: '2px solid #2563eb', height: 28, margin: '0 18px', display: 'inline-block', verticalAlign: 'middle' }}></span>
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
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: 0 }}>
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
                          style={{
                            marginRight: '18px',
                            minWidth: '170px', // szerokość na podstawie najdłuższego napisu
                            fontSize: '0.98em',
                            padding: '0.5em 1.1em',
                            textAlign: 'center',
                            display: 'inline-block'
                          }}
                          onClick={async () => {
                            if (!window.ethereum) {
                              setPopup({ visible: true, message: "MetaMask or other wallet required", txHash: null });
                              return;
                            }
                            try {
                              const provider = new ethers.BrowserProvider(window.ethereum);
                              const signer = await provider.getSigner();
                              let bytecode = "";
                              if (contract.name === "SimpleStorage") {
                                bytecode = "0x6080604052348015600e575f5ffd5b5060ba80601a5f395ff3fe6080604052348015600e575f5ffd5b5060043610603a575f3560e01c806309ce9ccb14603e5780633fb5c1cb146057578063f2c9ecd8146068575b5f5ffd5b60455f5481565b60405190815260200160405180910390f35b60666062366004606e565b5f55565b005b5f546045565b5f60208284031215607d575f5ffd5b503591905056fea26469706673582212200cf668aaa1a8919f982a5eb6458914b17b8d63ca0f5c3aac933d33cc0699e59264736f6c634300081e0033";
                              } else if (contract.name === "MessageBoard") {
                                bytecode = "0x6080604052348015600e575f5ffd5b506103ba8061001c5f395ff3fe608060405234801561000f575f5ffd5b506004361061003f575f3560e01c8063256fec881461004357806332970710146100735780636630f88f14610088575b5f5ffd5b600154610056906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b61007b61009d565b60405161006a9190610149565b61009b610096366004610192565b610128565b005b5f80546100a990610245565b80601f01602080910402602001604051908101604052809291908181526020018280546100d590610245565b80156101205780601f106100f757610100808354040283529160200191610120565b820191905f5260205f20905b81548152906001019060200180831161010357829003601f168201915b505050505081565b5f61013382826102c9565b5050600180546001600160a01b03191633179055565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b634e487b7160e01b5f52604160045260245ffd5b5f602082840312156101a2575f5ffd5b813567ffffffffffffffff8111156101b8575f5ffd5b8201601f810184136101c8575f5ffd5b803567ffffffffffffffff8111156101e2576101e261017e565b604051601f8201601f19908116603f0116810167ffffffffffffffff811182821017156102115761021161017e565b604052818152828201602001861015610228575f5ffd5b816020840160208301375f91810160200191909152949350505050565b600181811c9082168061025957607f821691505b60208210810361027757634e487b7160e01b5f52602260045260245ffd5b50919050565b601f8211156102c457805f5260205f20601f840160051c810160208510156102a25750805b601f840160051c820191505b818110156102c1575f81556001016102ae565b50505b505050565b815167ffffffffffffffff8111156102e3576102e361017e565b6102f7816102f18454610245565b8461027d565b6020601f821160018114610329575f83156103125750848201515b5f19600385901b1c1916600184901b1784556102c1565b5f84815260208120601f198516915b828110156103585787850151825560209485019460019092019101610338565b508482101561037557868401515f19600387901b60f8161c191681555b50505050600190811b0190555056fea264697066735822122081aa54c8ed61172532a488e962737c95dfb429d257ad3221825fb2c89316835664736f6c634300081e0033";
                              } else if (contract.name === "ClickCounter") {
                                bytecode = "0x6080604052348015600e575f5ffd5b5060c580601a5f395ff3fe6080604052348015600e575f5ffd5b50600436106030575f3560e01c806306661abd1460345780637d55923d14604d575b5f5ffd5b603b5f5481565b60405190815260200160405180910390f35b60536055565b005b60015f5f82825460649190606b565b9091555050565b80820180821115608957634e487b7160e01b5f52601160045260245ffd5b9291505056fea26469706673582212205c59a7297bf9296c81d569fd83247fe0bf9f7d0951f5a677a17656223aaee51864736f6c634300081e0033";
                              } else if (contract.name === "SimpleVoting") {
                                bytecode = "0x6080604052348015600e575f5ffd5b5060f38061001b5f395ff3fe6080604052348015600e575f5ffd5b50600436106044575f3560e01c80633c8d0bec14604857806355416e06146061578063847d52d6146069578063fb32aedb146071575b5f5ffd5b604f5f5481565b60405190815260200160405180910390f35b60676077565b005b604f60015481565b6067608d565b60015f5f828254608691906099565b9091555050565b6001805f828254608691905b8082018082111560b757634e487b7160e01b5f52601160045260245ffd5b9291505056fea26469706673582212201a53748d74d7a82011e00c648f970427f5f2a16a963e42bc8d7208522d889f1b64736f6c634300081e0033";
                              }
                              if (!bytecode) {
                                setPopup({ visible: true, message: `No bytecode for contract ${contract.name}`, txHash: null });
                                return;
                              }
                              const tx = await signer.sendTransaction({ data: bytecode });
                              const receipt = await tx.wait();
                              if (receipt.contractAddress) {
                                setPopup({
                                  visible: true,
                                  message: `Contract ${contract.name} deployed successfully!`,
                                  txHash: tx.hash
                                });
                              } else {
                                setPopup({ visible: true, message: "Could not get deployed contract address.", txHash: null });
                              }
                            } catch (err) {
                              if (err && err.message && (err.message.includes('user rejected') || err.message.includes('denied'))) {
                                setPopup({ visible: true, message: "Transaction aborted by user", txHash: null });
                              } else {
                                setPopup({ visible: true, message: "Deploy error: " + err.message, txHash: null });
                              }
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
              <Route path="/contract/simple-storage" element={
                <div style={{ maxWidth: 540, margin: '60px auto 32px auto', background: '#e9eaec', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '28px 32px', textAlign: 'left', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.08em', color: '#2563eb' }}>
                          <h2 style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.3em', marginBottom: '18px' }}>SimpleStorage</h2>
                          <div style={{ color: '#444', fontWeight: 400, fontSize: '1.08em', marginBottom: '18px' }}>
                            Bardzo prosty smart kontrakt, który pozwala na przechowywanie jednej liczby całkowitej. Każdy może ustawić nową wartość oraz ją odczytać. Idealny do nauki i testów działania blockchaina.
                          </div>
                          <div style={{ marginTop: '8px', borderRadius: '10px', background: '#e2e3e6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#d3d4d7', padding: '8px 18px 8px 18px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', borderBottom: '1px solid #bcbec2' }}>
                              <span style={{ color: '#444', fontSize: '0.86em', fontWeight: 600, letterSpacing: '0.04em' }}>solidity</span>
                              <div>
                                <button
                                  onClick={() => {
                                    const code = `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract SimpleStorage {\n    uint256 private value;\n\n    function set(uint256 newValue) public {\n        value = newValue;\n    }\n\n    function get() public view returns (uint256) {\n        return value;\n    }\n}`;
                                    navigator.clipboard.writeText(code);
                                  }}
                                  style={{
                                    background: '#e6e8eb',
                                    color: '#444',
                                    border: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.86em',
                                    cursor: 'pointer',
                                    marginRight: '10px',
                                    padding: '2px 10px',
                                    borderRadius: '4px',
                                    transition: 'background 0.2s'
                                  }}
                                  onMouseOver={e => e.currentTarget.style.background='#d1d3d6'}
                                  onMouseOut={e => e.currentTarget.style.background='#e6e8eb'}
                                >
                                  Copy
                                </button>
                              </div>
                            </div>
                            <pre style={{ background: 'none', color: '#222', fontSize: '1em', fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace', padding: '20px 18px', margin: 0, borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', overflowX: 'auto', minHeight: '220px' }}>
        {`// SPDX-License-Identifier: MIT
        pragma solidity ^0.8.0;

        contract SimpleStorage {
            uint256 private value;

            function set(uint256 newValue) public {
                value = newValue;
            }

            function get() public view returns (uint256) {
                return value;
            }
        }`}
                            </pre>
                          </div>
                </div>
              } />
              <Route path="/contract/click-counter" element={
                <div style={{ maxWidth: 540, margin: '60px auto 32px auto', background: '#e9eaec', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '28px 32px', textAlign: 'left', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.08em', color: '#2563eb' }}>
                  <h2 style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.3em', marginBottom: '18px' }}>ClickCounter</h2>
                  <div style={{ color: '#444', fontWeight: 400, fontSize: '1.08em', marginBottom: '18px' }}>
                    Bardzo prosty smart kontrakt, który zlicza liczbę kliknięć. Każdy może wywołać funkcję <code>click()</code>, aby zwiększyć licznik o jeden. Aktualną wartość licznika można odczytać przez <code>getCount()</code>. Kontrakt nie posiada uprawnień – każdy może kliknąć i odczytać licznik.
                  </div>
                  <div style={{ marginTop: '8px', borderRadius: '10px', background: '#e2e3e6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#d3d4d7', padding: '8px 18px 8px 18px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', borderBottom: '1px solid #bcbec2' }}>
                      <span style={{ color: '#444', fontSize: '0.86em', fontWeight: 600, letterSpacing: '0.04em' }}>solidity</span>
                      <div>
                        <button
                          onClick={() => {
                            const code = `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract ClickCounter {\n    uint256 public count;\n\n    function click() public {\n        count += 1;\n    }\n\n    function getCount() public view returns (uint256) {\n        return count;\n    }\n}`;
                            navigator.clipboard.writeText(code);
                          }}
                          style={{
                            background: '#e6e8eb',
                            color: '#444',
                            border: 'none',
                            fontWeight: 500,
                            fontSize: '0.86em',
                            cursor: 'pointer',
                            marginRight: '10px',
                            padding: '2px 10px',
                            borderRadius: '4px',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.background='#d1d3d6'}
                          onMouseOut={e => e.currentTarget.style.background='#e6e8eb'}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <pre style={{ background: 'none', color: '#222', fontSize: '1em', fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace', padding: '20px 18px', margin: 0, borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', overflowX: 'auto', minHeight: '180px' }}>
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClickCounter {
    uint256 public count;

    function click() public {
        count += 1;
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}`}
                    </pre>
                  </div>
                </div>
              } />
              <Route path="/contract/message-board" element={
                <div style={{ maxWidth: 540, margin: '60px auto 32px auto', background: '#e9eaec', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '28px 32px', textAlign: 'left', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.08em', color: '#2563eb' }}>
                  <h2 style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.3em', marginBottom: '18px' }}>MessageBoard</h2>
                  <div style={{ color: '#444', fontWeight: 400, fontSize: '1.08em', marginBottom: '18px' }}>
                    Smart kontrakt, który pozwala na zapisanie wiadomości wraz z adresem nadawcy. Każdy może odczytać ostatnią wiadomość oraz jej nadawcę. Przydatne do nauki o przechowywaniu danych na blockchainie.
                  </div>
                  <div style={{ marginTop: '8px', borderRadius: '10px', background: '#e2e3e6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#d3d4d7', padding: '8px 18px 8px 18px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', borderBottom: '1px solid #bcbec2' }}>
                      <span style={{ color: '#444', fontSize: '0.86em', fontWeight: 600, letterSpacing: '0.04em' }}>solidity</span>
                      <div>
                        <button
                          onClick={() => {
                            const code = `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract MessageBoard {\n    string private lastMessage;\n    address private lastSender;\n\n    function sendMessage(string calldata message) public {\n        lastMessage = message;\n        lastSender = msg.sender;\n    }\n\n    function getLastMessage() public view returns (string memory, address) {\n        return (lastMessage, lastSender);\n    }\n}`;
                            navigator.clipboard.writeText(code);
                          }}
                          style={{
                            background: '#e6e8eb',
                            color: '#444',
                            border: 'none',
                            fontWeight: 500,
                            fontSize: '0.86em',
                            cursor: 'pointer',
                            marginRight: '10px',
                            padding: '2px 10px',
                            borderRadius: '4px',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.background='#d1d3d6'}
                          onMouseOut={e => e.currentTarget.style.background='#e6e8eb'}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <pre style={{ background: 'none', color: '#222', fontSize: '1em', fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace', padding: '20px 18px', margin: 0, borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', overflowX: 'auto', minHeight: '180px' }}>
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageBoard {
    string private lastMessage;
    address private lastSender;

    function sendMessage(string calldata message) public {
        lastMessage = message;
        lastSender = msg.sender;
    }

    function getLastMessage() public view returns (string memory, address) {
        return (lastMessage, lastSender);
    }
}`}
                    </pre>
                  </div>
                </div>
              } />
              <Route path="/contract/simple-voting" element={
                <div style={{ maxWidth: 540, margin: '60px auto 32px auto', background: '#e9eaec', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '28px 32px', textAlign: 'left', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.08em', color: '#2563eb' }}>
                  <h2 style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.3em', marginBottom: '18px' }}>SimpleVoting</h2>
                  <div style={{ color: '#444', fontWeight: 400, fontSize: '1.08em', marginBottom: '18px' }}>
                    SimpleVoting to prosty kontrakt do głosowania. Każdy użytkownik może oddać głos na jedną z dwóch opcji (A lub B). Kontrakt zlicza głosy i pozwala odczytać aktualny wynik. Każdy może zagłosować tylko raz. Idealny do nauki mechanizmów głosowania na blockchainie.
                  </div>
                  <div style={{ marginTop: '8px', borderRadius: '10px', background: '#e2e3e6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#d3d4d7', padding: '8px 18px 8px 18px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', borderBottom: '1px solid #bcbec2' }}>
                      <span style={{ color: '#444', fontSize: '0.86em', fontWeight: 600, letterSpacing: '0.04em' }}>solidity</span>
                      <div>
                        <button
                          onClick={() => {
                            const code = `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract SimpleVoting {\n    enum VoteOption { A, B }\n    struct Voter {\n        bool hasVoted;\n        VoteOption vote;\n    }\n    mapping(address => Voter) public voters;\n    uint256 public voteACount;\n    uint256 public voteBCount;\n\n    function vote(VoteOption _vote) public {\n        require(!voters[msg.sender].hasVoted, "You have already voted.");\n        voters[msg.sender].hasVoted = true;\n        voters[msg.sender].vote = _vote;\n        if (_vote == VoteOption.A) {\n            voteACount++;\n        } else {\n            voteBCount++;\n        }\n    }\n\n    function getResult() public view returns (uint256, uint256) {\n        return (voteACount, voteBCount);\n    }\n}`;
                            navigator.clipboard.writeText(code);
                          }}
                          style={{
                            background: '#e6e8eb',
                            color: '#444',
                            border: 'none',
                            fontWeight: 500,
                            fontSize: '0.86em',
                            cursor: 'pointer',
                            marginRight: '10px',
                            padding: '2px 10px',
                            borderRadius: '4px',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.background='#d1d3d6'}
                          onMouseOut={e => e.currentTarget.style.background='#e6e8eb'}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <pre style={{ background: 'none', color: '#222', fontSize: '1em', fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace', padding: '20px 18px', margin: 0, borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', overflowX: 'auto', minHeight: '180px' }}>
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVoting {
    enum VoteOption { A, B }
    struct Voter {
        bool hasVoted;
        VoteOption vote;
    }
    mapping(address => Voter) public voters;
    uint256 public voteACount;
    uint256 public voteBCount;

    function vote(VoteOption _vote) public {
        require(!voters[msg.sender].hasVoted, "You have already voted.");
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].vote = _vote;
        if (_vote == VoteOption.A) {
            voteACount++;
        } else {
            voteBCount++;
        }
    }

    function getResult() public view returns (uint256, uint256) {
        return (voteACount, voteBCount);
    }
}`}
                    </pre>
                  </div>
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