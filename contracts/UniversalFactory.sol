    /**
     * @dev Deployuje kontrakt SimpleStorage z zapisanym bytecode
     * @return deployedAddress Adres wdrożonego kontraktu
     */
    function deploySimpleStorage() external returns (address deployedAddress) {
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, "SimpleStorage", block.timestamp));
        bytes memory bytecode = simpleStorageBytecode;
        assembly {
            deployedAddress := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(deployedAddress != address(0), "Deployment failed");
        userContracts[msg.sender].push(DeployedContract({
            contractAddress: deployedAddress,
            contractName: "SimpleStorage",
            timestamp: block.timestamp
        }));
        allContracts.push(DeployedContract({
            contractAddress: deployedAddress,
            contractName: "SimpleStorage",
            timestamp: block.timestamp
        }));
        emit ContractDeployed(msg.sender, deployedAddress, "SimpleStorage");
        return deployedAddress;
    }
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title UniversalFactory
 * @dev Kontrakt pozwalający na deploy dowolnego kontraktu przez podanie bytecode i opcjonalnych argumentów konstruktora.
 */
contract UniversalFactory {
    event ContractDeployed(address indexed deployer, address indexed contractAddress, string contractName);

    struct DeployedContract {
        address contractAddress;
        string contractName;
        uint256 timestamp;
    }

    mapping(address => DeployedContract[]) public userContracts;
    DeployedContract[] public allContracts;

    // Stały bytecode SimpleStorage (skompilowany przez Hardhat)
    bytes public simpleStorageBytecode = hex"6080604052348015600e575f5ffd5b506101718061001c5f395ff3fe608060405234801561000f575f5ffd5b506004361061003f575f3560e01c806309ce9ccb146100435780633fb5c1cb14610061578063f2c9ecd81461007d575b5f5ffd5b61004b61009b565b60405161005891906100c9565b60405180910390f35b61007b60048036038101906100769190610110565b6100a0565b005b6100856100a9565b60405161009291906100c9565b60405180910390f35b5f5481565b805f8190555050565b5f5f54905090565b5f819050919050565b6100c3816100b1565b82525050565b5f6020820190506100dc5f8301846100ba565b92915050565b5f5ffd5b6100ef816100b1565b81146100f9575f5ffd5b50565b5f8135905061010a816100e6565b92915050565b5f60208284031215610125576101246100e2565b5b5f610132848285016100fc565b9150509291505056fea2646970667358221220642ad829d44acce9c1df24fb3d7a5fc45864fdec6f927e07a6a5b9e972af3f5e64736f6c634300081e0033";

    /**
     * @dev Deployuje nowy kontrakt z podanym bytecode i nazwą.
     * @param bytecode Bytecode kontraktu do wdrożenia
     * @param contractName Nazwa kontraktu (dowolna, do historii)
     * @return deployedAddress Adres wdrożonego kontraktu
     */
    function deployContract(bytes memory bytecode, string memory contractName) external returns (address deployedAddress) {
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, contractName, block.timestamp));
        assembly {
            deployedAddress := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(deployedAddress != address(0), "Deployment failed");
        userContracts[msg.sender].push(DeployedContract({
            contractAddress: deployedAddress,
            contractName: contractName,
            timestamp: block.timestamp
        }));
        allContracts.push(DeployedContract({
            contractAddress: deployedAddress,
            contractName: contractName,
            timestamp: block.timestamp
        }));
        emit ContractDeployed(msg.sender, deployedAddress, contractName);
        return deployedAddress;
    }

    /**
     * @dev Zwraca listę kontraktów wdrożonych przez użytkownika
     */
    function getUserContracts(address user) external view returns (DeployedContract[] memory) {
        return userContracts[user];
    }

    /**
     * @dev Zwraca liczbę kontraktów wdrożonych przez użytkownika
     */
    function getUserContractCount(address user) external view returns (uint256) {
        return userContracts[user].length;
    }

    /**
     * @dev Zwraca szczegóły konkretnego kontraktu wdrożonego przez użytkownika
     */
    function getUserContract(address user, uint256 index) external view returns (DeployedContract memory) {
        require(index < userContracts[user].length, "Index out of bounds");
        return userContracts[user][index];
    }

    /**
     * @dev Zwraca globalną listę wszystkich wdrożonych kontraktów
     */
    function getAllContracts() external view returns (DeployedContract[] memory) {
        return allContracts;
    }
}
