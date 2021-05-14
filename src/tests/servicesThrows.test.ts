import associationService from '../services/association.service';
import mockAssociationTemplates from '../mocks/mockAssociation';
import contactMessagesService from '../services/contactMessage.service';
import mockMessageTemplates from '../mocks/mockMessage';
import transactionService from '../services/transaction.services';
import mockTransactionTemplates from '../mocks/mockTransaction';
import userService from '../services/user.service';
import mockUserTemplates from '../mocks/mockUser';

describe("test services throwings when not connected to db", () => {
  test("should throw when trying to get associations", async () => {
    await expect(() => associationService.serviceGetAssociations({})).rejects.toThrow("Error retrieving associations from database");
  });
  test("should throw when trying to add association", async () => {
    await expect(() => associationService.serviceAddAssociation(mockAssociationTemplates.mockAssociation)).rejects.toThrow("Error on inserting association to database");
  });
  test("should throw when trying to delete association", async () => {
    await expect(() => associationService.serviceDeleteAssociation(mockAssociationTemplates.mockAssociation.name)).rejects.toThrow("Error while deleting association");
  });
  test("should throw when trying to update association", async () => {
    await expect(() => associationService.serviceUpdateAssociation({}, mockAssociationTemplates.mockAssociation)).rejects.toThrow("Error while updating association");
  });

  test("should throw when trying to add a message", async () => {
    await expect(() => contactMessagesService.serviceContactMessage(mockMessageTemplates.mockMessage)).rejects.toThrow("Error on inserting message");
  });

  test("should throw when trying to get txs", async () => {
    await expect(() => transactionService.serviceGetTx({})).rejects.toThrow("Error retrieving transactions from database");
  });
  test("should throw when trying to add a tx", async () => {
    await expect(() => transactionService.serviceAddTx(mockTransactionTemplates.mockTransaction)).rejects.toThrow("Error on inserting transaction to database");
  });
  test("should throw when trying to delete a tx", async () => {
    await expect(() => transactionService.serviceDeleteTx(mockTransactionTemplates.mockTransaction.associationName)).rejects.toThrow("Error while deleting transaction");
  });
  test("should throw when trying to update a tx", async () => {
    await expect(() => transactionService.serviceUpdateTx({}, mockTransactionTemplates.mockTransaction.associationName)).rejects.toThrow("Error retrieving transactions from database");
  });

  test("should throw when trying to register a user", async () => {
    await expect(() => userService.serviceRegister(mockUserTemplates.mockUserSubscribing)).rejects.toThrow("URI malformed, cannot be parsed");
  });
  test("should throw when trying to get a user", async () => {
    await expect(() => userService.serviceGetUser(mockUserTemplates.mockUser.email)).rejects.toThrow("Error while retrieving user");
  });
  test("should throw when trying to delete a user", async () => {
    await expect(() => userService.serviceDeleteUser(mockUserTemplates.mockUser.email)).rejects.toThrow("Error while deleting user");
  });
  test("should throw when trying to login", async () => {
    await expect(() => userService.serviceLogin(mockUserTemplates.mockUserSubscribing)).rejects.toThrow("URI malformed, cannot be parsed");
  });
  test("should throw when trying to update a user associations", async () => {
    await expect(() => userService.serviceUpdateUserAssociations(mockUserTemplates.mockUserSubscribing)).rejects.toThrow("URI malformed, cannot be parsed");
  });
});