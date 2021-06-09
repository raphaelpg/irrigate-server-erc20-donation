// const Dai = artifacts.require("./Dai.sol");
const Dai = artifacts.require("./MintableERC20.sol");
const Irrigate = artifacts.require("./Irrigate.sol");

module.exports = (deployer, network) => {
  // deployer.deploy(Dai, 1337)
  deployer.deploy(Dai, "DAI", "DAI", 18)
  .then(() => {
    return deployer.deploy(Irrigate, Dai.address)
  });
};
