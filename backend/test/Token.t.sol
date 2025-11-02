// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {Token} from "../src/Token.sol";

contract TokenTest is Test {
    Token token;

    address user = address(0x1234);

    function setUp() public {
        token = new Token(msg.sender, "Smpyioe", "SYE", 1000);
    }

    // function testInitialSupply() public {
    //     uint256 supply = token.totalSupply();
    //     assertEq(supply, 1000 * 10 ** token.decimals());
    // }

    function testFaucet() public {
        vm.prank(user);
        token.faucet(500);

        uint256 balance = token.balanceOf(user);
        assertEq(balance, 500 * 10 ** token.decimals());
    }

    function testTransfer() public {
        token.transfer(address(0x5678), 100);
        uint256 bal = token.balanceOf(address(0x5678));
        assertEq(bal, 100);
    }
}
