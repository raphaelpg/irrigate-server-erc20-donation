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
      await irrigate.transferOwnership(newOwner, { from: originalOwner});
   
      const owner = await irrigate.owner();
      assert.equal(owner, newOwner, "The owner should be equal to newOwner");
    });
    
    it("it should reverts when sender is not authorized", async () => {
      await expectRevert(irrigate.transferOwnership(originalOwner, { from: originalOwner }), "Ownable: caller is not the owner");
    });
  });

  describe("mint and transfer Dai", async () => {
    it("can mint Dai", async () => {
      await dai.mint(donor, 100, { from: originalOwner});
      
      const account1balance = await dai.balanceOf(donor);
      assert.equal(account1balance, 100, "The balance of newOwner should be equal to 100 Dai");
    });

    it("can transfer Dai to Irrigate contract", async () => {
      await dai.transfer(irrigate.address, 50, { from: donor });
      
      const irrigateBalance = await dai.balanceOf(irrigate.address);
      assert.equal(irrigateBalance, 50, "The balance of irrigate should be equal to 50 Dai");
    });
    
    it("can transfer Dai from Irrigate contract to another address", async () => {
      await irrigate.transferToken(association, 20, { from: newOwner });
      
      const accounts3Balance = await dai.balanceOf(association);
      assert.equal(accounts3Balance, 20, "The balance of association should be equal to 20 Dai");
    });
    
    it("it should reverts when sender is not authorized", async () => {
      await expectRevert(irrigate.transferToken(originalOwner, 20, { from: originalOwner }), "Ownable: caller is not the owner");
    });

    it("it should reverts when balance is too low", async () => {
      await expectRevert(irrigate.transferToken(association, 200, { from: newOwner }), "Unsufficient balance");
    });
  });
});