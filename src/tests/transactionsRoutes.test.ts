import request from 'supertest';
import app from '../app';
import mockTransactionTemplates from '../mocks/mockTransaction';

describe("test transactions routes", () => {

  test("POST /api/donation/add Should reject if input not a string", (done) => {
    request(app)
      .post("/api/donation/add")
      .send(mockTransactionTemplates.mockTransactionNameNotAString)
      .expect(400)
      .then(response => {
        expect(response.body.msg).toEqual("Request field must be a string");
        done();
      })
      .catch(err => done(err));
  });

  test("POST /api/donation/add Should reject if input is empty", (done) => {
    request(app)
      .post("/api/donation/add")
      .send(mockTransactionTemplates.mockTransactionNameIsEmpty)
      .expect(400)
      .then(response => {
        expect(response.body.msg).toEqual("Requested field can't be empty");
        done();
      })
      .catch(err => done(err));
  });

  test("POST /api/donation/add", (done) => {
    request(app)
      .post("/api/donation/add")
      .send(mockTransactionTemplates.mockTransaction)
      .expect(201)
      .then(() => {
        done();
      })
      .catch(err => done(err));
  });

  // test("POST /api/transaction/update Should reject if input not a string", (done) => {
  //   request(app)
  //     .patch("/api/transaction/update")
  //     .send(mockTransactionTemplates.mockTransactionNameNotAString)
  //     .expect(400)
  //     .then(response => {
  //       expect(response.body.msg).toEqual("Request field must be a string");
  //       done();
  //     })
  //     .catch(err => done(err));
  // });

  // test("POST /api/transaction/update Should reject if input is empty", (done) => {
  //   request(app)
  //     .patch("/api/transaction/update")
  //     .send(mockTransactionTemplates.mockTransactionEmptyName)
  //     .expect(400)
  //     .then(response => {
  //       expect(response.body.msg).toEqual("Requested field can't be empty");
  //       done();
  //     })
  //     .catch(err => done(err));
  // });

  // test("PATCH /api/transaction/update", (done) => {
  //   request(app)
  //     .patch("/api/transaction/update")
  //     .send({ name: mockTransactionTemplates.mockTransaction.name, continent: "Worldwide", country: "Worldwide" })
  //     .expect(200)
  //     .then(() => {
  //       done();
  //     });
  // });

  // test("POST /api/transaction/delete Should reject if input not a string", (done) => {
  //   request(app)
  //     .delete("/api/transaction/delete")
  //     .send(mockTransactionTemplates.mockTransactionNameNotAString)
  //     .expect(400)
  //     .then(response => {
  //       expect(response.body.msg).toEqual("Request field must be a string");
  //       done();
  //     })
  //     .catch(err => done(err));
  // });

  // test("POST /api/transaction/delete Should reject if input is empty", (done) => {
  //   request(app)
  //     .delete("/api/transaction/delete")
  //     .send(mockTransactionTemplates.mockTransactionEmptyName)
  //     .expect(400)
  //     .then(response => {
  //       expect(response.body.msg).toEqual("Requested field can't be empty");
  //       done();
  //     })
  //     .catch(err => done(err));
  // });

  // test("POST /api/transaction/delete", (done) => {
  //   request(app)
  //     .delete("/api/transaction/delete")
  //     .send({ name: mockTransactionTemplates.mockTransaction.name })
  //     .expect(200)
  //     .then(() => {
  //       request(app)
  //         .get("/api/transactions")
  //         .expect(200)
  //         .then(response => {
  //           if (response.body.data.length > 0) {
  //             expect(response.body.data[response.body.data.length -1].name).not.toEqual(mockTransactionTemplates.mockTransaction.name);
  //           } else {
  //             expect(response.body.data.length).toEqual(0);
  //           }
  //           done();
  //         })
  //     })
  //     .catch(err => done(err));
  // });
});