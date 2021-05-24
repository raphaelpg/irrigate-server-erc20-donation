import request from 'supertest';
import app from '../app';
import mockTransactionTemplates from '../mocks/mockTransaction';
import transactionService from '../services/transaction.services';

describe("test nominal transaction services", () => {
  beforeAll(() => {
    request(app);
  });

  test("should add and get a tx properly", async () => {
    await transactionService.serviceAddTx(mockTransactionTemplates.mockTransaction);
    const txs = await transactionService.serviceGetTx({});
    expect(txs[txs.length-1].associationName).toEqual(mockTransactionTemplates.mockTransaction.associationName);
  });

  test("should update a tx properly", async () => {
    const txs = await transactionService.serviceGetTx({});
    const newAddress = "0xg";
    await transactionService.serviceUpdateTx({ donationId: txs[txs.length-1].donationId }, { associationAddress: newAddress });
    const newTxs = await transactionService.serviceGetTx({});
    expect(newTxs[txs.length-1].associationAddress).toMatch(newAddress);
  });
  
  test("should delete a tx properly", async () => {
    const newAddress = "0xg";
    await transactionService.serviceDeleteTx({ associationAddress: newAddress });
    const txs = await transactionService.serviceGetTx({});
    if (txs.length != 0) {
      await transactionService.serviceDeleteTx({ associationAddress: txs[txs.length-1].associationAddress });
      expect(txs[txs.length-1].associationAddress).toEqual(expect.not.stringMatching(newAddress));
    } else {
      expect(txs.length).toEqual(0);
    }
  });

  test("should throw when trying to update a nonexistent tx", async () => {
    await expect(() => transactionService.serviceUpdateTx({ donationId: "?" }, { associationAddress: "johndoe"})).rejects.toThrow("Can't find transaction");
  });
});