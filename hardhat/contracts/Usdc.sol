// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Usdc is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 100000000000000000000 * 10**6); // 1 million USDC avec 6 décimales
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}