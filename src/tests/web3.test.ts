import Web3 from 'web3';
import web3Functions from '../functions/web3Functions';
import config from '../config/config';
import erc20Interface from '../contracts/Dai.json';

describe("test web3 functions", () => {
  let erc20Address: string;
  
  test("should deploy erc20 contract", async () => {
    const erc20Contract: any = await web3Functions.deployERC20Contract();
    erc20Address = erc20Contract._address;
    expect(erc20Contract._address).toMatch("0x");
  });

  test("should return address balance", async () => {
    const balance = await web3Functions.getERC20Balance(config.web3.owner);
    expect(balance).toEqual("0");
  });

  test("should deploy irrigate contract", async () => {
    const irrigateContract: any = await web3Functions.deployIrrigateContract(erc20Address);
    expect(irrigateContract._address).toMatch("0x");
  });

  test("owner should be able to transfer erc20 from irrigate contract", async () => {
    const web3 = new Web3(config.web3.localProvider);
    const erc20Address = config.web3.erc20;
    const erc20Instance = new web3.eth.Contract(erc20Interface.abi as any, erc20Address);
    await erc20Instance.methods.mint(config.web3.irrigate, 1000).send({ from: config.web3.owner });

    const transferErc20 = await web3Functions.transferERC20FromIrrigate(config.web3.owner, "100", "donationId")
    expect(transferErc20).toEqual(true);
  });
});