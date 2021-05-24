import dbAccessFunctions from '../functions/dbAccessFunctions';
import config from '../config/config';
import IAssociation from '../interfaces/association';


const associationsCollection = config.mongo.associationsCollection;

const serviceGetAssociations = async (filter: {}) => {
  try {
    const associations = await dbAccessFunctions.find(associationsCollection, filter);
    return associations;
  } catch (e) {
    throw Error("Error retrieving associations from database");
  };
};

const serviceAddAssociation = async (query: IAssociation) => {
  
  try {
    query = { ...query, totalDaiRaised: 0, totalEthRaised: 0 }
    await dbAccessFunctions.insert(associationsCollection, { ...query });
    return;
  } catch (e) {
    throw Error("Error on inserting association to database");
  };
};

const serviceDeleteAssociation = async (filter: {}) => {
  try {
    await dbAccessFunctions.remove(associationsCollection, filter);
    return;
  } catch (e) {
    throw Error("Error while deleting association");
  };
};

const serviceUpdateAssociation = async (filter: {}, query: {}) => {
  try {
    await dbAccessFunctions.update(associationsCollection, filter, query);
    return;
  } catch (e) {
    throw Error("Error while updating association"); 
  };
};

export default {
  serviceGetAssociations,
  serviceAddAssociation,
  serviceDeleteAssociation,
  serviceUpdateAssociation
};