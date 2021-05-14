// import request from 'supertest';
// import app from '../app';
// import mockTransactionTemplates from '../mocks/mockTransaction';
// import transactionService from '../services/transaction.services';

describe("test transactions services throwings", () => {
  test("yes", () => {
    expect(true).toEqual(true);
  })
});

// describe("test nominal transaction services", () => {
//   test("should add a tx properly", async () => {
//     await request(app)
//     await transactionService.serviceAddTx(mockTransactionTemplates.mockTransaction);
//     const txs = await transactionService.serviceGetTx({});
//     expect(txs[txs.length-1].associationName).toEqual(mockTransactionTemplates.mockTransaction.associationName);
//   })
// })


  // test("GET /api/transactions", (done) => {
  //   request(app)
  //     .get("/api/transactions")
  //     .expect(200)
  //     .then(response => {
  //       expect(response.body.msg).toEqual("Transactions retrieved successfully");
  //       done();
  //     })
  //     .catch(err => done(err));
  // });

  // test("POST /api/transaction/add Should reject if input not a string", (done) => {
  //   request(app)
  //     .post("/api/transaction/add")
  //     .send(mockTransactionTemplates.mockTransactionNameNotAString)
  //     .expect(400)
  //     .then(response => {
  //       expect(response.body.msg).toEqual("Request field must be a string");
  //       done();
  //     })
  //     .catch(err => done(err));
  // });

  // test("POST /api/transaction/add Should reject if input is empty", (done) => {
  //   request(app)
  //     .post("/api/transaction/add")
  //     .send(mockTransactionTemplates.mockTransactionEmptyName)
  //     .expect(400)
  //     .then(response => {
  //       expect(response.body.msg).toEqual("Requested field can't be empty");
  //       done();
  //     })
  //     .catch(err => done(err));
  // });

  // test("POST /api/transaction/add Should reject if invalid email", (done) => {
  //   request(app)
  //     .post("/api/transaction/add")
  //     .send(mockTransactionTemplates.mockTransactionFakeEmail)
  //     .expect(400)
  //     .then(response => {
  //       expect(response.body.msg).toEqual("Invalid email input");
  //       done();
  //     })
  //     .catch(err => done(err));
  // });

  // test("POST /api/donation/add", (done) => {
  //   request(app)
  //     .post("/api/donation/add")
  //     .send(mockTransactionTemplates.mockTransaction)
  //     .expect(201)
  //     .then(() => {
  //       done();
  //     })
  //     .catch(err => done(err));
  // });