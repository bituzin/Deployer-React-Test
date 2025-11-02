// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract MessageBoard {
    string public lastMessage;
    address public lastSender;

    function postMessage(string memory message) public {
        lastMessage = message;
        lastSender = msg.sender;
    }
}
