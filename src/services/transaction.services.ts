import dbAccessFunctions from '../functions/dbAccessFunctions';
import config from '../config/config';
import ITx from '../interfaces/tx';

const txCollection = config.mongo.txCollection;

const serviceGetTx = async () => {
  try {
    const Txs = await dbAccessFunctions.find(txCollection, {});
    return Txs;
  } catch (e) {
    throw Error("Error retrieving transactions from database");
  };
};

const serviceAddTx = async (query: ITx, status: string) => {
  try {
    query.status = status;
    await dbAccessFunctions.insert(txCollection, { ...query });
    return;
  } catch (e) {
    throw Error("Error on inserting transaction to database");
  };
};

const serviceDeleteTx = async (name: string) => {
  try {
    await dbAccessFunctions.remove(txCollection, { name });
    return;
  } catch (e) {
    throw Error("Error while deleting transaction");
  };
};

const serviceUpdateTx = async (filter: {}, query: {}) => {
  try {
    await dbAccessFunctions.update(txCollection, filter, query);
    return;
  } catch (e) {
    throw Error("Error while updating association"); 
  };
};

const serviceProcessDonation = async (query: ITx) => {
  try {
    //add pending tx
    await serviceAddTx(query, "pending");
    //listen to web3 tx confirmation
    
    //compare web3 tx amount and sender with pending tx
    //if match, transfer (amount -1%) to association
    //update tx status  
    (
      setTimeout(async () => {
        const filter = { donorAddress: query.donorAddress, amount: query.amount };
        query.status = "executed";
        await serviceUpdateTx(filter, query);
        return
      }, 5000)
    );
  } catch (e) {
    throw Error("Error while proceeding donation");
  }
}

export default {
  serviceGetTx,
  serviceAddTx,
  serviceDeleteTx,
  serviceUpdateTx,
  serviceProcessDonation
};

/*
web3.eth.sendTransaction({from: '0x123...', data: '0x432...'})
.once('sending', function(payload){ ... })
.once('sent', function(payload){ ... })
.once('transactionHash', function(hash){ ... })
.once('receipt', function(receipt){ ... })
.on('confirmation', function(confNumber, receipt, latestBlockHash){ ... })
.on('error', function(error){ ... })
.then(function(receipt){
    // will be fired once the receipt is mined
})
*/