import request from 'supertest';
import app from '../app';
import mockTransactionTemplates from '../mocks/mockTransaction';
import txProcessing from '../txProcessing';
import Web3 from 'web3';
import config from '../config/config';
import erc20Interface from '../contracts/Dai.json';

describe("test txProcessing functions", () => {
  it("should transfer funds - fee after receiving a donation", async (done) => {
    await txProcessing.startTxProcessingEngine();
    request(app)
      .post("/api/donation/add")
      .send(mockTransactionTemplates.mockTransactionForTxProcessingTest)
      .then(async () => {
        const donationAmount = parseInt(mockTransactionTemplates.mockTransactionForTxProcessingTest.amount);
        const web3 = new Web3(config.web3.localProvider);
        const erc20Address = config.web3.erc20;
        const erc20Instance = new web3.eth.Contract(erc20Interface.abi as any, erc20Address);
        const associationInitialBalance = parseInt(await erc20Instance.methods.balanceOf(mockTransactionTemplates.mockTransactionForTxProcessingTest.associationAddress).call());
        await erc20Instance.methods.mint(config.web3.owner, donationAmount).send({ from: config.web3.owner });
        await erc20Instance.methods.transfer(config.web3.irrigate, donationAmount).send({ from: config.web3.owner });
        setTimeout(async () => {
          const associationFinalBalance = parseInt(await erc20Instance.methods.balanceOf(mockTransactionTemplates.mockTransactionForTxProcessingTest.associationAddress).call());
          expect(associationFinalBalance).toEqual(associationInitialBalance + (donationAmount - (donationAmount / config.params.fee)));
          done();
        }, 3000)
      })
      .catch(err => done(err));
  })
})