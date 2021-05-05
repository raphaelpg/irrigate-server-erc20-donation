import dbAccessFunctions from '../functions/dbAccessFunctions';
import config from '../config/config';
import IContactMessage from '../interfaces/contactMessage';

const contactMessagesCollection = config.mongo.contactMessagesCollection;

const serviceContactMessage = async (query: IContactMessage) => {
	try {
		return await dbAccessFunctions.insert(contactMessagesCollection, { ...query });
	} catch (e) {
		throw Error("Error on inserting message");
	};
};

export default {
	serviceContactMessage
};