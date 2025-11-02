// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(address owner, string memory name_,string memory symbol_,uint256 initialSupply_) ERC20(name_, symbol_) {
        _mint(owner, initialSupply_ * 10 ** decimals());
    }

    function faucet(uint256 amount) external {
        _mint(msg.sender, amount * 10 ** decimals());
    }
}
