import { ethers } from "ethers";
import SimpleStorageArtifact from "./artifacts/SimpleStorage.json";

export async function deploySimpleStorageBase(signer) {
  // Adres kontraktu SimpleFactory na Base (przykładowy, podmień na swój jeśli masz)
  const SIMPLE_FACTORY_ADDRESS = "0xYourFactoryAddressOnBase";
  // ABI SimpleFactory
  const SIMPLE_FACTORY_ABI = [
    "function deployContract(bytes bytecode, string contractName) external returns (address)"
  ];

  // Przygotuj bytecode SimpleStorage
  const bytecode = SimpleStorageArtifact.bytecode;
  const factory = new ethers.Contract(SIMPLE_FACTORY_ADDRESS, SIMPLE_FACTORY_ABI, signer);

  // Wywołaj deploy przez SimpleFactory
  const tx = await factory.deployContract(bytecode, "SimpleStorage");
  const receipt = await tx.wait();
  // Pobierz adres wdrożonego kontraktu z eventu
  const event = receipt.events.find(e => e.event === "ContractDeployed");
  return event?.args?.contractAddress;
}
