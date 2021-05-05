import { MongoClient, Db } from 'mongodb';
import config from '../config/config';

const url: string = config.mongo.completeUri;
const dbName: string = config.mongo.dbName;
const client = new MongoClient(url, { useNewUrlParser: true,	useUnifiedTopology: true });

const connectDb: () => Promise<Db> = async () => {
	if (!client.isConnected()) {
		await client.connect();
	};
	return client.db(dbName);
};

const find: (collection: string, query: {}) => Promise<any[]> = async (collection: string, { ...query }) => {
  const database = await connectDb();
  const result = await database.collection(collection).find({ ...query }).toArray();
  return result;
};

const insert = async (collection: string, { ...query }) => {
  const database = await connectDb();
  const date = Date.now().toString();
	const result = await database.collection(collection).insertOne({ creationDate: date, ...query });
  if (result.insertedCount === 1) return result;
  throw Error('Error inserting item');
};

const remove = async (collection: string, { ...query }) => {
  const database = await connectDb();
  const result = await database.collection(collection).deleteOne({ ...query });
  if (result.deletedCount === 1) return result;
  throw Error('Error deleting item');
};

const update = async (collection: string, filter: {}, query: {}) => {
  const database = await connectDb();
  const result = await database.collection(collection).updateOne(filter, [{ $set: query }]);
  if (result.matchedCount === 1) return result;
  throw Error('Error updating item');
};

export default {
  find,
  insert,
  remove,
  update,
};