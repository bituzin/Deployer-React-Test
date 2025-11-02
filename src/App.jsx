
import { useState } from "react";
import { ethers } from "ethers";
// Importy JSON z kompilacji kontraktów (do podmiany na prawdziwe pliki po kompilacji)
// import contractOneJson from "../artifacts/ContractOne.json";
// import contractTwoJson from "../artifacts/ContractTwo.json";
// import contractThreeJson from "../artifacts/ContractThree.json";
// import contractFourJson from "../artifacts/ContractFour.json";
// import contractFiveJson from "../artifacts/ContractFive.json";

// Tymczasowe placeholdery ABI i bytecode (do podmiany na prawdziwe po kompilacji)
const contracts = [
  { name: "SimpleStorage", abi: [
    {
      "inputs": [],
      "name": "getNumber",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "num", "type": "uint256" }
      ],
      "name": "setNumber",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "storedNumber",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ], bytecode: "0x6080604052348015600e575f5ffd5b506101718061001c5f395ff3fe608060405234801561000f575f5ffd5b506004361061003f575f3560e01c806309ce9ccb146100435780633fb5c1cb14610061578063f2c9ecd81461007d575b5f5ffd5b61004b61009b565b60405161005891906100c9565b60405180910390f35b61007b60048036038101906100769190610110565b6100a0565b005b6100856100a9565b60405161009291906100c9565b60405180910390f35b5f5481565b805f8190555050565b5f5f54905090565b5f819050919050565b6100c3816100b1565b82525050565b5f6020820190506100dc5f8301846100ba565b92915050565b5f5ffd5b6100ef816100b1565b81146100f9575f5ffd5b50565b5f8135905061010a816100e6565b92915050565b5f60208284031215610125576101246100e2565b5b5f610132848285016100fc565b9150509291505056fea26469706673582212208d6380075ccb711635f30ba22de12911531f9bf16b1a6bb9608fedaadc38e4ae64736f6c634300081c0033" },
  { name: "MessageBoard", abi: [], bytecode: "0x" },
  { name: "ClickCounter", abi: [], bytecode: "0x" },
  { name: "SimpleVoting", abi: [], bytecode: "0x" },
];

export default function App() {
  const [deployedAddresses, setDeployedAddresses] = useState(Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [storageValue, setStorageValue] = useState("");
  const [message, setMessage] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [lastSender, setLastSender] = useState("");
  const [network, setNetwork] = useState("base");
  const [walletAddress, setWalletAddress] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask required");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    } catch (err) {
      alert("Wallet connection failed: " + err.message);
    }
  }

  async function deployContract(idx) {
    if (!window.ethereum) {
      alert("MetaMask required");
      return;
    }
    setLoading(true);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // Sieci Base i Celo: sprawdź chainId i poproś o przełączenie jeśli trzeba
      const chains = {
        base: { chainId: "0x2105", name: "Base" }, // Base Mainnet: 8453 (0x2105)
        celo: { chainId: "0xa4ec", name: "Celo" }  // Celo Mainnet: 42220 (0xa4ec)
      };
      const selected = chains[network];
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChainId !== selected.chainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: selected.chainId }]
          });
        } catch (switchError) {
          alert(`Przełącz portfel na sieć ${selected.name}`);
          setLoading(false);
          return;
        }
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ethers.ContractFactory(contracts[idx].abi, contracts[idx].bytecode, signer);
      const contract = await factory.deploy();
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      setDeployedAddresses((prev) => {
        const copy = [...prev];
        copy[idx] = address;
        return copy;
      });
    } catch (err) {
      alert("Deployment failed: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>React DApp: Deploy Smart Contracts</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={connectWallet} style={{ marginRight: 10 }}>
          Connect Wallet
        </button>
        {walletAddress && (
          <span style={{ color: '#555' }}>Połączono: {walletAddress}</span>
        )}
      </div>
      <div style={{ marginBottom: 30 }}>
        <label><b>Wybierz sieć:</b> </label>
        <select
          value={network}
          onChange={async e => {
            const newNetwork = e.target.value;
            setNetwork(newNetwork);
            if (window.ethereum) {
              const chains = {
                base: { chainId: "0x2105", name: "Base" },
                celo: { chainId: "0xa4ec", name: "Celo" }
              };
              const selected = chains[newNetwork];
              const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
              if (currentChainId !== selected.chainId) {
                try {
                  await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: selected.chainId }]
                  });
                } catch (err) {
                  alert(`Przełącz portfel na sieć ${selected.name}`);
                }
              }
            }
          }}
          style={{ marginLeft: 10 }}
        >
          <option value="base">Base</option>
          <option value="celo">Celo</option>
        </select>
      </div>
      {contracts.map((c, idx) => (
        <div key={c.name} style={{ marginBottom: 20 }}>
          <button onClick={() => deployContract(idx)} disabled={loading}>
            Deploy {idx === 1 ? "MessageBoard" : c.name}
          </button>
          <span style={{ marginLeft: 10, color: '#555', fontSize: '0.95em' }}>
            {idx === 0 && "Przechowuje liczbę, którą możesz ustawić i odczytać."}
            {idx === 1 && "Tablica wiadomości – każdy może zapisać i odczytać ostatnią wiadomość oraz nadawcę."}
            {idx === 2 && "Licznik kliknięć – każdy może zwiększać licznik globalny."}
            {idx === 3 && "Głosowanie – każdy może zagłosować na opcję A lub B."}
            {idx === 4 && "(Przykładowy kontrakt – podmień na swój pomysł!)"}
          </span>
          {deployedAddresses[idx] && (
            <>
              <span style={{ marginLeft: 10 }}>Deployed at: {deployedAddresses[idx]}</span>
              {idx === 0 && (
                <>
                  <button
                    style={{ marginLeft: 10 }}
                    onClick={async () => {
                      if (!window.ethereum) {
                        alert("MetaMask required");
                        return;
                      }
                      try {
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        const contract = new ethers.Contract(
                          deployedAddresses[0],
                          [
                            { "inputs": [], "name": "getNumber", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
                          ],
                          provider
                        );
                        const value = await contract.getNumber();
                        setStorageValue(value.toString());
                      } catch (err) {
                        alert("Read failed: " + err.message);
                      }
                    }}
                  >
                    Odczytaj SimpleStorage
                  </button>
                  <input
                    type="number"
                    placeholder="Nowa wartość"
                    value={storageValue}
                    style={{ marginLeft: 10, width: 100 }}
                    onChange={e => setStorageValue(e.target.value)}
                  />
                  <button
                    style={{ marginLeft: 10 }}
                    onClick={async () => {
                      if (!window.ethereum) {
                        alert("MetaMask required");
                        return;
                      }
                      try {
                        await window.ethereum.request({ method: "eth_requestAccounts" });
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        const signer = await provider.getSigner();
                        const contract = new ethers.Contract(
                          deployedAddresses[0],
                          [
                            { "inputs": [{ "internalType": "uint256", "name": "num", "type": "uint256" }], "name": "setNumber", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
                          ],
                          signer
                        );
                        await contract.setNumber(storageValue);
                        alert("Wartość została zmieniona!");
                      } catch (err) {
                        alert("Set failed: " + err.message);
                      }
                    }}
                  >
                    Zmień wartość
                  </button>
                </>
              )}
              {idx === 1 && (
                <>
                  <input
                    type="text"
                    placeholder="Wpisz wiadomość"
                    value={message}
                    style={{ marginLeft: 10 }}
                    onChange={e => setMessage(e.target.value)}
                  />
                  <button
                    style={{ marginLeft: 10 }}
                    onClick={async () => {
                      if (!window.ethereum) {
                        alert("MetaMask required");
                        return;
                      }
                      try {
                        await window.ethereum.request({ method: "eth_requestAccounts" });
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        const signer = await provider.getSigner();
                        const contract = new ethers.Contract(
                          deployedAddresses[1],
                          [
                            { "inputs": [{ "internalType": "string", "name": "message", "type": "string" }], "name": "postMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
                            { "inputs": [], "name": "lastMessage", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
                            { "inputs": [], "name": "lastSender", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }
                          ],
                          signer
                        );
                        await contract.postMessage(message);
                        setMessage("");
                      } catch (err) {
                        alert("Send failed: " + err.message);
                      }
                    }}
                  >
                    Wyślij wiadomość
                  </button>
                  <button
                    style={{ marginLeft: 10 }}
                    onClick={async () => {
                      if (!window.ethereum) {
                        alert("MetaMask required");
                        return;
                      }
                      try {
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        const contract = new ethers.Contract(
                          deployedAddresses[1],
                          [
                            { "inputs": [], "name": "lastMessage", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
                            { "inputs": [], "name": "lastSender", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }
                          ],
                          provider
                        );
                        const msg = await contract.lastMessage();
                        const sender = await contract.lastSender();
                        setLastMessage(msg);
                        setLastSender(sender);
                      } catch (err) {
                        alert("Read failed: " + err.message);
                      }
                    }}
                  >
                    Odczytaj wiadomość
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ))}
      {storageValue && (
        <div style={{ marginTop: 20 }}>
          <b>Wartość SimpleStorage:</b> {storageValue}
        </div>
      )}
      {lastMessage && (
        <div style={{ marginTop: 20 }}>
          <b>Ostatnia wiadomość:</b> {lastMessage}<br />
          <b>Nadawca:</b> {lastSender}
        </div>
      )}
    </div>
  );
}
