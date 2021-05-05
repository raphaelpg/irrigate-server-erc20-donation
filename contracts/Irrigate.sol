// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";

contract Irrigate is Ownable {

  event ReceivedEther(address sender, uint amount);
  
  receive() external payable {
    emit ReceivedEther(msg.sender, msg.value);
  }
  
  fallback() external payable {
    revert();
  }
}