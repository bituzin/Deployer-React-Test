// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract ClickCounter {
    uint256 public count;

    function click() public {
        count += 1;
    }
}
