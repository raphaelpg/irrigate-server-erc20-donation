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

const serviceAddTx = async (query: ITx) => {
  try {
    query.status = "pending";
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

const serviceUpdateTx = async (name: {}, query: {}) => {
  try {
    await dbAccessFunctions.update(txCollection, name, query);
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