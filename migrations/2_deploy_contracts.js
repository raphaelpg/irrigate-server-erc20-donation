const Dai = artifacts.require("Dai");
const Irrigate = artifacts.require("Irrigate");

module.exports = function (deployer) {
  deployer.deploy(Dai, 5777);
  deployer.deploy(Irrigate);
};
