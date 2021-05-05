import dbAccessFunctions from '../functions/dbAccessFunctions';
import config from '../config/config';
import IAssociation from '../interfaces/association';

const associationsCollection = config.mongo.associationsCollection;

const serviceGetAssociations = async () => {
  try {
    const associations = await dbAccessFunctions.find(associationsCollection, {});
    return associations;
  } catch (e) {
    throw Error("Error retrieving associations from database");
  };
};

const serviceAddAssociation = async (query: IAssociation) => {
  try {
    await dbAccessFunctions.insert(associationsCollection, { ...query });
    return;
  } catch (e) {
    throw Error("Error on inserting association to database");
  };
};

const serviceDeleteAssociation = async (name: string) => {
  try {
    await dbAccessFunctions.remove(associationsCollection, { name });
    return;
  } catch (e) {
    throw Error("Error while deleting association");
  };
};

const serviceUpdateAssociation = async (name: {}, query: {}) => {
  try {
    await dbAccessFunctions.update(associationsCollection, name, query);
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