import request from 'supertest';
import app from '../app';
import mockTransactionTemplates from '../mocks/mockTransaction';
import txProcessing from '../txProcessing';
import Web3 from 'web3';
import config from '../config/config';
import erc20Interface from '../contracts/Dai.json';
import transactionService from '../services/transaction.services';

describe("test txProcessing functions", () => {
  it("should transfer (funds - fee) after receiving a donation", async (done) => {
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
  });

  it("tx status should be updated correctly", async () => {
    const txs = await transactionService.serviceGetTx({});
    expect(txs[txs.length-1].fundsStatus).toEqual("received");
    expect(txs[txs.length-1].transferStatus).toEqual("transferred");
  });
  
  it("should delete tx properly", async () => {
    const txs = await transactionService.serviceGetTx({});
    await transactionService.serviceDeleteTx({ associationName: txs[txs.length-1].associationName });
    const emptyTxs = await transactionService.serviceGetTx({});
    expect(typeof(emptyTxs[0])).toEqual("undefined");
  });

  it("should not transfer (funds - fee) after receiving an insufficient donation", async (done) => {
    await txProcessing.startTxProcessingEngine();
    request(app)
      .post("/api/donation/add")
      .send(mockTransactionTemplates.mockTransactionForTxProcessingTest)
      .then(async () => {
        const donationAmount = parseInt(mockTransactionTemplates.mockTransactionForTxProcessingTest.amount) - 1;
        const web3 = new Web3(config.web3.localProvider);
        const erc20Address = config.web3.erc20;
        const erc20Instance = new web3.eth.Contract(erc20Interface.abi as any, erc20Address);
        const associationInitialBalance = parseInt(await erc20Instance.methods.balanceOf(mockTransactionTemplates.mockTransactionForTxProcessingTest.associationAddress).call());
        await erc20Instance.methods.mint(config.web3.owner, donationAmount).send({ from: config.web3.owner });
        await erc20Instance.methods.transfer(config.web3.irrigate, donationAmount).send({ from: config.web3.owner });
        setTimeout(async () => {
          const associationFinalBalance = parseInt(await erc20Instance.methods.balanceOf(mockTransactionTemplates.mockTransactionForTxProcessingTest.associationAddress).call());
          expect(associationFinalBalance).toEqual(associationInitialBalance);
          done();
        }, 3000)
      })
      .catch(err => done(err));
  });

  it("tx status should be updated correctly", async () => {
    const txs = await transactionService.serviceGetTx({});
    expect(txs[txs.length-1].fundsStatus).toEqual("pending");
    expect(txs[txs.length-1].transferStatus).toEqual("pending");
  });
  
  it("should delete tx properly", async () => {
    const txs = await transactionService.serviceGetTx({});
    await transactionService.serviceDeleteTx({ associationName: txs[txs.length-1].associationName });
    const emptyTxs = await transactionService.serviceGetTx({});
    expect(typeof(emptyTxs[0])).toEqual("undefined");
  });

  it("should transfer (funds - fee) after receiving a superior donation", async (done) => {
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
        console.log("associationInitialBalance", associationInitialBalance)
        await erc20Instance.methods.mint(config.web3.owner, donationAmount + 1).send({ from: config.web3.owner });
        await erc20Instance.methods.transfer(config.web3.irrigate, donationAmount + 1).send({ from: config.web3.owner });
        setTimeout(async () => {
          const associationFinalBalance = parseInt(await erc20Instance.methods.balanceOf(mockTransactionTemplates.mockTransactionForTxProcessingTest.associationAddress).call());
          console.log("associationFinalBalance", associationFinalBalance)
          expect(associationFinalBalance).toEqual(associationInitialBalance + (donationAmount - (donationAmount / config.params.fee)));
          done();
        }, 3000)
      })
      .catch(err => done(err));
  });

  it("tx status should be updated correctly", async () => {
    const txs = await transactionService.serviceGetTx({});
    expect(txs[txs.length-1].fundsStatus).toEqual("received");
    expect(txs[txs.length-1].transferStatus).toEqual("transferred");
  });
  
  it("should delete tx properly", async () => {
    const txs = await transactionService.serviceGetTx({});
    await transactionService.serviceDeleteTx({ associationName: txs[txs.length-1].associationName });
    const emptyTxs = await transactionService.serviceGetTx({});
    expect(typeof(emptyTxs[0])).toEqual("undefined");
  });

  it("should not transfer (funds - fee) if association is not listed", async (done) => {
    await txProcessing.startTxProcessingEngine();
    request(app)
      .post("/api/donation/add")
      .send(mockTransactionTemplates.mockTransactionForTxProcessingTestNotListedAssociation)
      .then(async () => {
        const donationAmount = parseInt(mockTransactionTemplates.mockTransactionForTxProcessingTestNotListedAssociation.amount);
        const web3 = new Web3(config.web3.localProvider);
        const erc20Address = config.web3.erc20;
        const erc20Instance = new web3.eth.Contract(erc20Interface.abi as any, erc20Address);
        const associationInitialBalance = parseInt(await erc20Instance.methods.balanceOf(mockTransactionTemplates.mockTransactionForTxProcessingTestNotListedAssociation.associationAddress).call());
        await erc20Instance.methods.mint(config.web3.owner, donationAmount).send({ from: config.web3.owner });
        await erc20Instance.methods.transfer(config.web3.irrigate, donationAmount).send({ from: config.web3.owner });
        setTimeout(async () => {
          const associationFinalBalance = parseInt(await erc20Instance.methods.balanceOf(mockTransactionTemplates.mockTransactionForTxProcessingTestNotListedAssociation.associationAddress).call());
          expect(associationFinalBalance).toEqual(associationInitialBalance);
          done();
        }, 3000)
      })
      .catch(err => done(err));
  });

  it("tx status should not be updated", async () => {
    const txs = await transactionService.serviceGetTx({});
    expect(txs[txs.length-1].fundsStatus).toEqual("pending");
    expect(txs[txs.length-1].transferStatus).toEqual("pending");
  });
  
  it("should delete tx properly", async () => {
    const txs = await transactionService.serviceGetTx({});
    await transactionService.serviceDeleteTx({ associationName: txs[txs.length-1].associationName });
    const emptyTxs = await transactionService.serviceGetTx({});
    expect(typeof(emptyTxs[0])).toEqual("undefined");
  });
});