// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract SimpleVoting {
    uint256 public votesOptionA;
    uint256 public votesOptionB;

    function voteA() public {
        votesOptionA += 1;
    }

    function voteB() public {
        votesOptionB += 1;
    }
}
