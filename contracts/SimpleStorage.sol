// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public storedNumber;

    function setNumber(uint256 num) public {
        storedNumber = num;
    }

    function getNumber() public view returns (uint256) {
        return storedNumber;
    }
}
