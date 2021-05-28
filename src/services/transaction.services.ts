import dbAccessFunctions from '../functions/dbAccessFunctions';
import config from '../config/config';
import ITx from '../interfaces/tx';

const txCollection = config.mongo.txCollection;

const serviceGetTx = async (filter: {}) => {
  try {
    const Txs = await dbAccessFunctions.find(txCollection, filter);
    return Txs;
  } catch (e) {
    throw Error("Error retrieving transactions from database");
  };
};

const serviceAddTx = async (query: ITx) => {
  try {
    query.donationId = (BigInt(Date.now()) + BigInt(query.amount)).toString();
    query.fundsStatus = "pending";
    query.transferStatus = "pending";
    query.fee = (parseInt(query.amount) / config.params.fee).toString();
    await dbAccessFunctions.insert(txCollection, { ...query });
    return query.donationId;
  } catch (e) {
    throw Error("Error on inserting transaction to database");
  };
};

const serviceDeleteTx = async (filter: {}) => {
  try {
    await dbAccessFunctions.remove(txCollection, filter);
    return;
  } catch (e) {
    throw Error("Error while deleting transaction");
  };
};

const serviceUpdateTx = async (filter: {}, query: {}) => {
  const txs = await serviceGetTx(filter);
  if (txs.length === 0) {
    throw Error("Can't find transaction");
  };
  try {
    await dbAccessFunctions.update(txCollection, filter, query);
    return;
  } catch (e) {
    throw Error("Error while updating transaction"); 
  };
};

export default {
  serviceGetTx,
  serviceAddTx,
  serviceDeleteTx,
  serviceUpdateTx
};