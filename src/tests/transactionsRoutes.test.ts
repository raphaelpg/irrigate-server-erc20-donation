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

  test("DELETE api/donation/delete Should delete tx properly", (done) => {
    request(app)
      .delete("/api/donation/delete")
      .send(mockTransactionTemplates.mockTransactionToDelete)
      .expect(200)
      .then(() => {
        done();
      })
      .catch(err => done(err));
  });
});