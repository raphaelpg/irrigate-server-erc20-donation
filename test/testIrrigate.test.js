const { expectRevert } = require("@openzeppelin/test-helpers");

const Dai = artifacts.require("Dai");
const Irrigate = artifacts.require("Irrigate");

contract("Irrigate", (accounts) => {
  let chainId;
  let dai;
  let irrigate;


  before(async () => {
    chainId = await web3.eth.getChainId();
    dai = await Dai.deployed(chainId);
    irrigate = await Irrigate.deployed();
  });

  describe("get owner", async () => {
    it("can fetch the owner of the contract", async () => {
      const owner = await irrigate.owner();
   
      assert.equal(owner, accounts[0], "The owner should be equal to accounts[0]");
    });
  });

  describe("transfer ownership", async () => {
    it("can transfer the ownership of the contract", async () => {
      await irrigate.transferOwnership(accounts[1], { from: accounts[0]});
   
      const owner = await irrigate.owner();
   
      assert.equal(owner, accounts[1], "The owner should be equal to accounts[1]");
    });
    
    it("it should reverts when sender is not authorized", async () => {
      await expectRevert(irrigate.transferOwnership(accounts[0], { from: accounts[0] }), "Ownable: caller is not the owner");
    });
  });

  describe("mint and transfer Dai", async () => {
    it("can mint Dai", async () => {
      await dai.mint(accounts[2], 100, { from: accounts[0]});
      
      const account1balance = await dai.balanceOf(accounts[2]);
      
      assert.equal(account1balance, 100, "The balance of accounts[1] should be equal to 100 Dai");
    });

    it("can transfer Dai to Irrigate contract", async () => {
      await dai.transfer(irrigate.address, 50, { from: accounts[2] });
      
      const irrigateBalance = await dai.balanceOf(irrigate.address);
      
      assert.equal(irrigateBalance, 50, "The balance of irrigate should be equal to 50 Dai");
    });
    
    it("can transfer Dai from Irrigate contract to another address", async () => {
      await irrigate.transferToken(accounts[3], 20, { from: accounts[1] });
      
      const accounts3Balance = await dai.balanceOf(accounts[3]);
      assert.equal(accounts3Balance, 20, "The balance of accounts[3] should be equal to 20 Dai");
    });
    
    it("it should reverts when sender is not authorized", async () => {
      await expectRevert(irrigate.transferToken(accounts[0], 20, { from: accounts[0] }), "Ownable: caller is not the owner");
    });

    it("it should reverts when balance is too low", async () => {
      await expectRevert(irrigate.transferToken(accounts[3], 200, { from: accounts[1] }), "Unsufficient balance");
    });
  });
});