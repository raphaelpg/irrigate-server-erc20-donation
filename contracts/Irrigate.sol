// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Pausable.sol";
import "./Dai.sol";

contract Irrigate is Ownable, ReentrancyGuard, Pausable {
  address public tokenAddress;

  event ReceivedEther(address indexed sender, uint indexed amount);
  event EtherSent(address indexed dest, uint indexed amount);
  event TokenAddressChanged(address indexed previousToken, address indexed newToken);
  event TokenTransfer(address indexed dest, uint indexed amount, uint indexed donationId);
  
  constructor(address _tokenAddress) {
    tokenAddress = _tokenAddress;
  }

  receive() external payable whenNotPaused {
    emit ReceivedEther(msg.sender, msg.value);
  }
  
  fallback() external payable {
    revert();
  }

  function lockContract() public onlyOwner {
    _pause();
  }

  function unlockContract() public onlyOwner {
    _unpause();
  }

  function transferEth(address payable dest, uint amountInWei) public whenNotPaused onlyOwner nonReentrant {
    require(address(this).balance > 0, "Insufficient balance");
    dest.transfer(amountInWei);
    emit EtherSent(dest, amountInWei);
  }

  function setTokenAddress(address newTokenAddress) public whenPaused onlyOwner {
    address previousTokenAddress = tokenAddress;
    tokenAddress = newTokenAddress;
    emit TokenAddressChanged(previousTokenAddress, tokenAddress);
  }

  function transferToken(address dest, uint amount, uint donationId) public whenNotPaused onlyOwner nonReentrant {
    Dai tokenContract = Dai(tokenAddress);
    require(tokenContract.balanceOf(address(this)) >= amount, "Insufficient balance");
    require(tokenContract.transferFrom(address(this), dest, amount) == true, "Could not send tokens to the buyer");
    emit TokenTransfer(dest, amount, donationId);
  }
}