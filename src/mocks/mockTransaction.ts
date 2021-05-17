import config from '../config/config';
import mockAssociationTemplates from './mockAssociation';

const mockTransactionTemplates = {
  mockTransaction: {
    associationName: "Red Cross", 
    associationAddress: "0xc5B006b7F6b511A3f8faf17aA967d1B89EA364Bf", 
    amount: "100", 
    donorAddress: "0xaF2D50549ab5de06E1d288B304E39Ce8B7a7002c",
    currency: "dai"
  },

  mockTransactionNameNotAString: {
    associationName: {}, 
    associationAddress: "0xc5B006b7F6b511A3f8faf17aA967d1B89EA364Bf", 
    amount: "100", 
    donorAddress: "0xaF2D50549ab5de06E1d288B304E39Ce8B7a7002c",
    currency: "dai"
  },

  mockTransactionNameIsEmpty: {
    associationName:"", 
    associationAddress: "0xc5B006b7F6b511A3f8faf17aA967d1B89EA364Bf", 
    amount: "100", 
    donorAddress: "0xaF2D50549ab5de06E1d288B304E39Ce8B7a7002c",
    currency: "dai"
  },
  
  mockTransactionForTxProcessingTest: {
    associationName: "Mock association", 
    associationAddress: mockAssociationTemplates.mockAssociation.address, 
    amount: "100", 
    donorAddress: config.web3.owner,
    currency: "dai"
  },
  
  mockTransactionForTxProcessingTestNotListedAssociation: {
    associationName: "Not Listed", 
    associationAddress: "0xc5B006b7F6b511A3f8faf17aA967d1B89EA364Bf", 
    amount: "100", 
    donorAddress: config.web3.owner,
    currency: "dai"
  }
}

export default mockTransactionTemplates;