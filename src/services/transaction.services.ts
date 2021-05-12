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

// const serviceGetTxByAddressAmount = async (donorAddress: string) => {
//   try {
//     const Txs = await dbAccessFunctions.find(txCollection, { donorAddress });
//     return Txs;
//   } catch (e) {
//     throw Error("Error retrieving transactions from database");
//   };
// };

const serviceAddTx = async (query: ITx, status: string) => {
  try {
    query.fundsStatus = status;
    query.transferStatus = "pending";
    query.fee = (parseInt(query.amount) / 100).toString();
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

// const serviceUpdateTx = async (query: ITx) => {
//   const txs = await findTxByAddress(query.donorAddress);
//   if (txs.length === 0) {
//     throw Error("Can't find transaction");
//   };
//   try {
//     return await dbAccessFunctions.update(txCollection, {donorAddress: query.donorAddress}, query)
//   } catch {
//     throw Error("Error when trying to update");
//   }
// }

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
  // serviceGetTxByAddressAmount,
  serviceAddTx,
  serviceDeleteTx,
  serviceUpdateTx
};