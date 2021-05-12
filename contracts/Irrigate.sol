// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Pausable.sol";
import "./Dai.sol";

contract Irrigate is Ownable, ReentrancyGuard, Pausable {
  address public tokenAddress;

  event ReceivedEther(address sender, uint amount);
  event EtherSent(address dest, uint amount);
  event TokenAddressChanged(address previousToken, address newToken);
  event TokenTransfer(address dest, uint amount, string donationId);
  
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

  function transferToken(address dest, uint amount, string memory donationId) public whenNotPaused onlyOwner nonReentrant {
    Dai tokenContract = Dai(tokenAddress);
    require(tokenContract.balanceOf(address(this)) >= amount, "Insufficient balance");
    require(tokenContract.transferFrom(address(this), dest, amount) == true, "Could not send tokens to the buyer");
    emit TokenTransfer(dest, amount, donationId);
  }
}