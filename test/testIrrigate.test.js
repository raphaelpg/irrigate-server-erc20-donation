const { expectRevert } = require("@openzeppelin/test-helpers");

const Irrigate = artifacts.require("Irrigate");

contract("Irrigate", (accounts) => {
  let irrigate;

  before(async () => {
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
});