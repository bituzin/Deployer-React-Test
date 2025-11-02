import { useState } from "react";
import { ethers } from "ethers";

// Adres prostego Factory (do ustawienia po deploymencie)
const SIMPLE_FACTORY_ADDRESS = ""; // Wstaw adres po deploymencie

// ABI prostego Factory
const SIMPLE_FACTORY_ABI = [
  {
    "inputs": [
      { "internalType": "bytes", "name": "bytecode", "type": "bytes" },
      { "internalType": "string", "name": "contractName", "type": "string" }
    ],
    "name": "deployContract",
    "outputs": [
      { "internalType": "address", "name": "deployedAddress", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getUserContracts",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "contractAddress", "type": "address" },
          { "internalType": "string", "name": "contractName", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct SimpleFactory.DeployedContract[]",
        "name": "contracts",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getUserContractCount",
    "outputs": [
      { "internalType": "uint256", "name": "count", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "deployer", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "contractAddress", "type": "address" },
      { "internalType": "string", "name": "contractName", "type": "string" }
    ],
    "name": "ContractDeployed",
    "type": "event"
  }
];

// Proste kontrakty do testowania
const testContracts = [
  { 
    name: "SimpleStorage", 
    bytecode: "0x6080604052348015600e575f5ffd5b506101718061001c5f395ff3fe608060405234801561000f575f5ffd5b506004361061003f575f3560e01c806309ce9ccb146100435780633fb5c1cb14610061578063f2c9ecd81461007d575b5f5ffd5b61004b61009b565b60405161005891906100c9565b60405180910390f35b61007b60048036038101906100769190610110565b6100a0565b005b6100856100a9565b60405161009291906100c9565b60405180910390f35b5f5481565b805f8190555050565b5f5f54905090565b5f819050919050565b6100c3816100b1565b82525050565b5f6020820190506100dc5f8301846100ba565b92915050565b5f5ffd5b6100ef816100b1565b81146100f9575f5ffd5b50565b5f8135905061010a816100e6565b92915050565b5f60208284031215610125576101246100e2565b5b5f610132848285016100fc565b9150509291505056fea2646970667358221220642ad829d44acce9c1df24fb3d7a5fc45864fdec6f927e07a6a5b9e972af3f5e64736f6c634300081e0033"
  },
  { 
    name: "ClickCounter", 
    bytecode: "0x6080604052348015600e575f5ffd5b506101a48061001c5f395ff3fe608060405234801561000f575f5ffd5b506004361061004a575f3560e01c80633c8d0bec1461004e57806355416e061461006c578063847d52d614610076578063fb32aedb14610094575b5f5ffd5b61005661009e565b60405161006391906100f5565b60405180910390f35b6100746100a3565b005b61007e6100bd565b60405161008b91906100f5565b60405180910390f35b61009c6100c3565b005b5f5481565b60015f5f8282546100b4919061013b565b92505081905550565b60015481565b6001805f8282546100d4919061013b565b92505081905550565b5f819050919050565b6100ef816100dd565b82525050565b5f6020820190506101085f8301846100e6565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610145826100dd565b9150610150836100dd565b92508282019050808211156101685761016761010e565b5b9291505056fea264697066735822122088023dbd641dafe6eab20b0881455dac2ea77518e19cdf7a0853fd5393413c5564736f6c634300081e0033"
  }
];

export default function SimpleFactoryApp() {
  const [walletAddress, setWalletAddress] = useState("");
  const [deploymentHistory, setDeploymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask required");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
      loadUserContracts(accounts[0]);
    } catch (err) {
      alert("Wallet connection failed: " + err.message);
    }
  }

  async function loadUserContracts(userAddress = walletAddress) {
    if (!SIMPLE_FACTORY_ADDRESS || !userAddress) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const factoryContract = new ethers.Contract(SIMPLE_FACTORY_ADDRESS, SIMPLE_FACTORY_ABI, provider);
      
      const contracts = await factoryContract.getUserContracts(userAddress);
      setDeploymentHistory(contracts.map(contract => ({
        address: contract.contractAddress,
        name: contract.contractName,
        timestamp: new Date(Number(contract.timestamp) * 1000).toLocaleString()
      })));
    } catch (err) {
      console.error("Failed to load contracts:", err.message);
    }
  }

  async function deployContract(contractIndex) {
    if (!SIMPLE_FACTORY_ADDRESS) {
      alert("Factory Contract address not set!");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factoryContract = new ethers.Contract(SIMPLE_FACTORY_ADDRESS, SIMPLE_FACTORY_ABI, signer);
      
      const contract = testContracts[contractIndex];
      const tx = await factoryContract.deployContract(contract.bytecode, contract.name);
      
      const receipt = await tx.wait();
      alert(`Contract ${contract.name} deployed successfully!`);
      
      // Odśwież historię
      loadUserContracts();
      
    } catch (err) {
      alert("Deployment failed: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>🏭 Simple Factory - Test DApp</h2>
      
      {!SIMPLE_FACTORY_ADDRESS && (
        <div style={{ padding: 15, backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: 5, marginBottom: 20 }}>
          ⚠️ <b>Ustaw adres Factory Contract:</b> Wdróż SimpleFactory i wstaw adres w <code>SIMPLE_FACTORY_ADDRESS</code>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <button onClick={connectWallet}>
          {walletAddress ? `Connected: ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
        </button>
      </div>

      <h3>📋 Deploy Test Contracts</h3>
      {testContracts.map((contract, idx) => (
        <div key={idx} style={{ marginBottom: 15, padding: 10, border: "1px solid #ddd", borderRadius: 5 }}>
          <b>{contract.name}</b>
          <br />
          <small style={{ color: "#666" }}>
            {contract.name === "SimpleStorage" && "Kontrakt do przechowywania liczby"}
            {contract.name === "ClickCounter" && "Licznik kliknięć"}
          </small>
          <br />
          <button 
            onClick={() => deployContract(idx)} 
            disabled={loading || !walletAddress || !SIMPLE_FACTORY_ADDRESS}
            style={{ marginTop: 10, padding: "5px 10px" }}
          >
            {loading ? "Deploying..." : `🚀 Deploy ${contract.name}`}
          </button>
        </div>
      ))}

      <hr style={{ margin: "30px 0" }} />

      <h3>📜 Deployment History</h3>
      {walletAddress && (
        <button onClick={() => loadUserContracts()} style={{ marginBottom: 15, padding: "5px 10px" }}>
          🔄 Refresh History
        </button>
      )}

      {deploymentHistory.length === 0 ? (
        <p style={{ color: "#666", fontStyle: "italic" }}>
          {!walletAddress ? "Connect wallet to see deployment history" : "No contracts deployed yet"}
        </p>
      ) : (
        <div style={{ border: "1px solid #ddd", borderRadius: 5 }}>
          {deploymentHistory.map((deployment, idx) => (
            <div 
              key={idx} 
              style={{ 
                padding: 10, 
                borderBottom: idx < deploymentHistory.length - 1 ? "1px solid #eee" : "none",
                backgroundColor: idx % 2 === 0 ? "#fafafa" : "white"
              }}
            >
              <div><b>📄 {deployment.name}</b></div>
              <div style={{ fontSize: "0.9em", color: "#666" }}>
                📍 <code>{deployment.address}</code>
              </div>
              <div style={{ fontSize: "0.9em", color: "#666" }}>
                ⏰ {deployment.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}