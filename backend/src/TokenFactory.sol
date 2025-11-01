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

    event TokenCreated(address indexed owner, address tokenAddress);

    function createToken(string name, string symbol, uint256 supply) external {
        Token token = new Token(name,symbol,supply);
        userTokens[msg.sender].push(TokenInfo(address(token), name, symbol, supply));
        emit TokenCreated(msg.sender, address(newToken));
    }

    function getMyTokens() external view returns (TokenInfo[] memory) {
        return userTokens[msg.sender];
    }
}