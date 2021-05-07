const Dai = artifacts.require("./Dai.sol");
const Irrigate = artifacts.require("./Irrigate.sol");

module.exports = (deployer, network) => {
  deployer.deploy(Dai, 1337)
  .then(() => {
    return deployer.deploy(Irrigate, Dai.address)
  });
};
