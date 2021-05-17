import config from '../config/config';

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
    associationAddress: "0x22Bf65A7735E763777640C4Be9040f7E1A76eF96", 
    amount: "100", 
    donorAddress: config.web3.owner,
    currency: "dai"
  },
  
  mockTransactionForTxProcessingTestNotListedAssociation: {
    associationName: "Not Listed", 
    associationAddress: "0xc072de888b2785d9E56E0f89e7b53D811d65e39d", 
    amount: "100", 
    donorAddress: config.web3.owner,
    currency: "dai"
  }
}

export default mockTransactionTemplates;