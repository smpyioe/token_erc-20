// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import  {Token} from "./Token.sol";


contract TokenFactory{
    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint256 supply;
    }

    mapping(address => TokenInfo[]) public userTokens;


    function createToken(string memory name, string memory symbol, uint256 supply) external {
        Token token = new Token(msg.sender, name,symbol,supply);
        userTokens[msg.sender].push(TokenInfo(address(token), name, symbol, supply));
    }

    function getMyTokens() external view returns (TokenInfo[] memory) {
        return userTokens[msg.sender];
    }
}