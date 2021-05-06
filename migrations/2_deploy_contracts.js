const Dai = artifacts.require("./Dai.sol");
const Irrigate = artifacts.require("./Irrigate.sol");

module.exports = async (deployer, network) => {
  chainId = await web3.eth.getChainId();
  deployer.deploy(Dai, chainId).then(function() {
    return deployer.deploy(Irrigate, Dai.address)
  });
};
