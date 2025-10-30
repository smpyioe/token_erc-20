// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.13;

// import {Script} from "forge-std/Script.sol";
// import {Token} from "../src/Token.sol";

// contract DeployToken is Script {
//     function run() external {
//         string memory name_ = vm.envString("TOKEN_NAME");
//         string memory symbol_ = vm.envString("TOKEN_SYMBOL");
//         uint256 initialSupply_ = vm.envUint("TOKEN_SUPPLY");

//         vm.startBroadcast();

//         Token token = new Token(name_, symbol_, initialSupply_);

//         vm.stopBroadcast();

//         //  Log l’adresse du token déployé
//         console2.log("Token deployed at:", address(token));
//     }
// }
