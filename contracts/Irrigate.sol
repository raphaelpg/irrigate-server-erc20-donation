// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Dai.sol";

contract Irrigate is Ownable, ReentrancyGuard {
  address public tokenAddress;

  event ReceivedEther(address sender, uint amount);
  event TokenAddressChanged(address previousToken, address newToken);
  event TokenTransfer(address dest, uint amount);
  
  constructor(address _tokenAddress) {
    tokenAddress = _tokenAddress;
  }

  receive() external payable {
    emit ReceivedEther(msg.sender, msg.value);
  }
  
  fallback() external payable {
    revert();
  }

  function setTokenAddress(address newTokenAddress) public onlyOwner {
    address previousTokenAddress = tokenAddress;
    tokenAddress = newTokenAddress;
    emit TokenAddressChanged(previousTokenAddress, tokenAddress);
  }

  function transferToken(address dest, uint amount) public onlyOwner nonReentrant {
    Dai tokenContract = Dai(tokenAddress);
    require(tokenContract.balanceOf(address(this)) >= amount, "Unsufficient balance");
    require(tokenContract.transferFrom(address(this), dest, amount) == true, "Could not send tokens to the buyer");
    emit TokenTransfer(dest, amount);
  }
}