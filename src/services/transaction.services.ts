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

const findTxByAddressAndAmount: (filter : {}) => Promise<ITx[]> = async (filter) => {
  const result = await dbAccessFunctions.find(txCollection, filter);
  return result;
}

const serviceAddTx = async (query: ITx) => {
  try {
    query.donationId = Date.now().toString() + query.donorAddress + query.associationAddress;
    query.fundsStatus = "pending";
    query.transferStatus = "pending";
    query.fee = (parseInt(query.amount) / config.params.fee).toString();
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
  const txs = await findTxByAddressAndAmount(filter);
  if (txs.length === 0) {
    throw Error("Can't find transaction");
  };
  try {
    await dbAccessFunctions.update(txCollection, filter, query);
    return;
  } catch (e) {
    throw Error("Error while updating association"); 
  };
};

export default {
  serviceGetTx,
  serviceAddTx,
  serviceDeleteTx,
  serviceUpdateTx
};