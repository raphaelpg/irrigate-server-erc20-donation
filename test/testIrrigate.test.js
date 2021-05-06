const { expectRevert } = require("@openzeppelin/test-helpers");

const Dai = artifacts.require("Dai");
const Irrigate = artifacts.require("Irrigate");

contract("Irrigate", (accounts) => {
  let chainId;
  let dai;
  let irrigate;
  let [originalOwner, newOwner, donor, association] = accounts;

  before(async () => {
    chainId = await web3.eth.getChainId();
    dai = await Dai.deployed(chainId);
    irrigate = await Irrigate.deployed();
  });

  describe("get owner", async () => {
    it("can fetch the owner of the contract", async () => {
      const owner = await irrigate.owner();
      assert.equal(owner, originalOwner, "The owner should be equal to originalOwner");
    });
  });

  describe("transfer ownership", async () => {
    it("can transfer the ownership of the contract", async () => {
      await irrigate.transferOwnership(newOwner, { from: originalOwner });
   
      const owner = await irrigate.owner();
      assert.equal(owner, newOwner, "The owner should be equal to newOwner");
    });
    
    it("should reverts when sender is not authorized", async () => {
      await expectRevert(irrigate.transferOwnership(originalOwner, { from: originalOwner }), "Ownable: caller is not the owner");
    });
  });

  describe("can receive and transfer Eth", async () => {
    it('irrigate contract balance should starts with 0 ETH', async () => {
      let balance = await web3.eth.getBalance(irrigate.address);
      assert.equal(balance, 0, "The balance of irrigate contract should be equal to 0 Eth");
    });
    
    it("can receive Eth", async () => {
      let five_eth = web3.utils.toWei("5", "ether");
      await web3.eth.sendTransaction({ from: donor, to: irrigate.address, value: five_eth});

      let balance_wei = await web3.eth.getBalance(irrigate.address);
      let balance_ether = web3.utils.fromWei(balance_wei, "ether");
      assert.equal(balance_ether, 5, "The balance of irrigate contract should be equal to 5 Eth");
    });

    it("can send Eth", async () => {
      let amountInWei = web3.utils.toWei("3", "ether");
      await irrigate.transferEth(newOwner, amountInWei, { from: newOwner });

      let balance_wei = await web3.eth.getBalance(irrigate.address);
      let balance_ether = web3.utils.fromWei(balance_wei, "ether");
      assert.equal(balance_ether, 2, "The balance of irrigate contract should be equal to 2 Eth");
    });

    it("should reverts transferEth when sender is not authorized", async () => {
      let amountInWei = web3.utils.toWei("3", "ether");
      await expectRevert(irrigate.transferEth(originalOwner, amountInWei, { from: originalOwner }), "Ownable: caller is not the owner");
    });
  })

  describe("mint and transfer Dai", async () => {
    it("can mint Dai", async () => {
      await dai.mint(donor, 100, { from: originalOwner});
      
      const donorBalance = await dai.balanceOf(donor);
      assert.equal(donorBalance, 100, "The balance of the donor should be equal to 100 Dai");
    });

    it("can transfer Dai to Irrigate contract", async () => {
      await dai.transfer(irrigate.address, 50, { from: donor });
      
      const irrigateBalance = await dai.balanceOf(irrigate.address);
      assert.equal(irrigateBalance, 50, "The balance of irrigate should be equal to 50 Dai");
    });
    
    it("can transfer Dai from Irrigate contract to another address", async () => {
      await irrigate.transferToken(association, 20, { from: newOwner });
      
      const associationBalance = await dai.balanceOf(association);
      assert.equal(associationBalance, 20, "The balance of association should be equal to 20 Dai");
    });

    it("can transfer Dai from Irrigate contract to the owner", async () => {
      await irrigate.transferToken(newOwner, 30, { from: newOwner });
      
      const newOwnerBalance = await dai.balanceOf(newOwner);
      assert.equal(newOwnerBalance, 30, "The balance of newOwner should be equal to 30 Dai");
    });
    
    it("should reverts when sender is not authorized", async () => {
      await expectRevert(irrigate.transferToken(originalOwner, 20, { from: originalOwner }), "Ownable: caller is not the owner");
    });

    it("should reverts when balance is too low", async () => {
      await expectRevert(irrigate.transferToken(association, 200, { from: newOwner }), "Insufficient balance");
    });
  });

  describe("change token address", async () => {
    it("can change the token address", async () => {
      let newAddress = "0x0000000000000000000000000000000000000000";
      await irrigate.setTokenAddress(newAddress, { from: newOwner });

      const tokenAddress = await irrigate.tokenAddress.call();
      assert.equal(tokenAddress, newAddress, "The token address should be equal to the newAddress");
    });

    it("should reverts when sender is not authorized", async () => {
      await expectRevert(irrigate.setTokenAddress(originalOwner, { from: originalOwner }), "Ownable: caller is not the owner");
    });
  });
});