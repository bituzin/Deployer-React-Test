import '../src/index.css';

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
  { name: "MessageBoard", abi: [
    {
      "inputs": [],
      "name": "lastMessage",
      "outputs": [
        { "internalType": "string", "name": "", "type": "string" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lastSender",
      "outputs": [
        { "internalType": "address", "name": "", "type": "address" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "message", "type": "string" }
      ],
      "name": "postMessage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ], bytecode: "0x6080604052348015600e575f5ffd5b506107148061001c5f395ff3fe608060405234801561000f575f5ffd5b506004361061003f575f3560e01c8063256fec881461004357806332970710146100615780636630f88f1461007f575b5f5ffd5b61004b61009b565b60405161005891906101dc565b60405180910390f35b6100696100c0565b6040516100769190610265565b60405180910390f35b610099600480360381019061009491906103c2565b61014b565b005b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f80546100cc90610436565b80601f01602080910402602001604051908101604052809291908181526020018280546100f890610436565b80156101435780601f1061011a57610100808354040283529160200191610143565b820191905f5260205f20905b81548152906001019060200180831161012657829003601f168201915b505050505081565b805f9081610159919061060f565b503360015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6101c68261019d565b9050919050565b6101d6816101bc565b82525050565b5f6020820190506101ef5f8301846101cd565b92915050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f610237826101f5565b61024181856101ff565b935061025181856020860161020f565b61025a8161021d565b840191505092915050565b5f6020820190508181035f83015261027d818461022d565b905092915050565b5f604051905090565b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6102d48261021d565b810181811067ffffffffffffffff821117156102f3576102f261029e565b5b80604052505050565b5f610305610285565b905061031182826102cb565b919050565b5f67ffffffffffffffff8211156103305761032f61029e565b5b6103398261021d565b9050602081019050919050565b828183375f83830152505050565b5f61036661036184610316565b6102fc565b9050828152602081018484840111156103825761038161029a565b5b61038d848285610346565b509392505050565b5f82601f8301126103a9576103a8610296565b5b81356103b9848260208601610354565b91505092915050565b5f602082840312156103d7576103d661028e565b5b5f82013567ffffffffffffffff8111156103f4576103f3610292565b5b61040084828501610395565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061044d57607f821691505b6020821081036104605761045f610409565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026104c27fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610487565b6104cc8683610487565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f61051061050b610506846104e4565b6104ed565b6104e4565b9050919050565b5f819050919050565b610529836104f6565b61053d61053582610517565b848454610493565b825550505050565b5f5f905090565b610554610545565b61055f818484610520565b505050565b5b81811015610582576105775f8261054c565b600181019050610565565b5050565b601f8211156105c75761059881610466565b6105a184610478565b810160208510156105b0578190505b6105c46105bc85610478565b830182610564565b50505b505050565b5f82821c905092915050565b5f6105e75f19846008026105cc565b1980831691505092915050565b5f6105ff83836105d8565b9150826002028217905092915050565b610618826101f5565b67ffffffffffffffff8111156106315761063061029e565b5b61063b8254610436565b610646828285610586565b5f60209050601f831160018114610677575f8415610665578287015190505b61066f85826105f4565b8655506106d6565b601f19841661068586610466565b5f5b828110156106ac57848901518255600182019150602085019450602081019050610687565b868310156106c957848901516106c5601f8916826105d8565b8355505b6001600288020188555050505b50505050505056fea2646970667358221220dae5ee40b97f247c5c57823e8ec9d92ba3bf2a56dc3f22b4bbec80127a15b24064736f6c634300081e0033" },
  { name: "ClickCounter", abi: [
    {
      "inputs": [],
      "name": "click",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "count",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ], bytecode: "0x6080604052348015600e575f5ffd5b5061012f8061001c5f395ff3fe6080604052348015600e575f5ffd5b50600436106030575f3560e01c806306661abd1460345780637d55923d14604e575b5f5ffd5b603a6056565b604051604591906089565b60405180910390f35b6054605b565b005b5f5481565b60015f5f828254606a919060cd565b92505081905550565b5f819050919050565b6083816073565b82525050565b5f602082019050609a5f830184607c565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f60d5826073565b915060de836073565b925082820190508082111560f35760f260a0565b5b9291505056fea26469706673582212207fb3a1d4bb05774f550699bed4c42011c46e18f54e8bf2b875f96de56eddf94064736f6c634300081e0033" },
  { name: "SimpleVoting", abi: [
    {
      "inputs": [],
      "name": "voteA",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "voteB",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votesOptionA",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votesOptionB",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ], bytecode: "0x6080604052348015600e575f5ffd5b506101a48061001c5f395ff3fe608060405234801561000f575f5ffd5b506004361061004a575f3560e01c80633c8d0bec1461004e57806355416e061461006c578063847d52d614610076578063fb32aedb14610094575b5f5ffd5b61005661009e565b60405161006391906100f5565b60405180910390f35b6100746100a3565b005b61007e6100bd565b60405161008b91906100f5565b60405180910390f35b61009c6100c3565b005b5f5481565b60015f5f8282546100b4919061013b565b92505081905550565b60015481565b6001805f8282546100d4919061013b565b92505081905550565b5f819050919050565b6100ef816100dd565b82525050565b5f6020820190506101085f8301846100e6565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610145826100dd565b9150610150836100dd565b92508282019050808211156101685761016761010e565b5b9291505056fea264697066735822122088023dbd641dafe6eab20b0881455dac2ea77518e19cdf7a0853fd5393413c5564736f6c634300081e0033" },
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
      const chains = {
        base: { chainId: "0x2105", name: "Base" },
        celo: { chainId: "0xa4ec", name: "Celo" }
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
          console.error(switchError);
          alert(`Przełącz portfel na sieć ${selected.name}\nSzczegóły: ${switchError.message || JSON.stringify(switchError)}`);
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
      console.error(err);
      alert("Deployment failed: " + (err.message || JSON.stringify(err)));
    }
    setLoading(false);
  }

  return (
    <div className="App">
      {/* Nagłówek jak w IBB react */}
      <div className="header" style={{ display: 'flex', alignItems: 'center', padding: '18px 40px', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
        <span className="header-title">
          Deploy Your Smart Contract <span style={{fontWeight:400}}>to</span>
        </span>
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
                } catch {
                  alert(`Przełącz portfel na sieć ${selected.name}`);
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
      {/* Główna zawartość przesunięta w dół */}
      <div style={{ padding: 40, paddingTop: 100 }}>
              <div style={{ marginBottom: 20 }}>
                <button onClick={connectWallet} style={{ marginRight: 10 }}>
                  Connect Wallet
                </button>
                {walletAddress && (
                  <span style={{ color: '#555' }}>Połączono: {walletAddress}</span>
                )}
              </div>
              {contracts.map((c, idx) => (
                <div key={c.name} style={{ marginBottom: 20 }}>
                  <button onClick={() => deployContract(idx)} disabled={loading}>
                    {idx === 1 ? "MessageBoard" : c.name}
                  </button>
                  <span style={{ marginLeft: 10, color: '#555', fontSize: '0.95em' }}>
                    {idx === 0 && "Przechowuje liczbę, którą możesz ustawić i odczytać."}
                    {idx === 1 && "Tablica wiadomości – każdy może zapisać i odczytać ostatnią wiadomość oraz nadawcę."}
                    {idx === 2 && "Licznik kliknięć – każdy może zwiększać licznik globalny."}
                    {idx === 3 && "Głosowanie – każdy może zagłosować na opcję A lub B."}
                    {idx === 4 && "(Przykładowy kontrakt – podmień na swój pomysł!)"}
                  </span>
                  {deployedAddresses[idx] && (
                    <span style={{ marginLeft: 10 }}>Deployed at: {deployedAddresses[idx]}</span>
                  )}
                  {/* ...pozostała logika przycisków i interakcji... */}
                </div>
              ))}
            </div>
          </div>
        );
      }
// ...existing code...
// Poprawna końcówka pliku
