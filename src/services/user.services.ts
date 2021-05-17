import dbAccessFunctions from '../functions/dbAccessFunctions';
import config from '../config/config';
import encryptFunctions from '../functions/encryptFunctions';
import IUser from '../interfaces/user';

const usersCollection = config.mongo.usersCollection;

const findUserByEmail: (email: string) => Promise<IUser[]> = async (email) => {
	const result = await dbAccessFunctions.find(usersCollection, { email });
  return result;
};

const serviceRegister = async (query: IUser) => {
  const result = await findUserByEmail(query.email);
  if (result.length !== 0) {
    throw Error("Email address already used");
  };
  try {
    const { email, password } = query;
    const hashedPassword = await encryptFunctions.hashString(password);
    return await dbAccessFunctions.insert(usersCollection, { email, password: hashedPassword, subscribedAssociations: [], role: "USER" });
  } catch (e) {
    throw Error("Error while inserting user");
  };
};

const serviceGetUser = async (email: string) => {
  try {
    const user = await dbAccessFunctions.find(usersCollection, { email });
    delete user[0].password;
    return user;
  } catch (e) {
    throw Error("Error while retrieving user");
  };
};

const serviceDeleteUser = async (email: string) => {
  try {
    return await dbAccessFunctions.remove(usersCollection, { email });
  } catch (e) {
    throw Error("Error while deleting user");
  };
};

const serviceLogin = async (query: IUser) => {
  const users: any = await findUserByEmail(query.email);
  if (users.length === 0) {
    throw Error("Can't find user");
  };
  try {
    if (await encryptFunctions.comparePasswords(query.password, users[0].password)) {
      delete users[0].password;
      return users[0];
    } else {
      throw Error("Error when trying to login");
    }
  } catch {
    throw Error("Error when trying to login");
  };
};

const serviceUpdateUserAssociations = async (query: IUser) => {
  const users = await findUserByEmail(query.email);
  if (users.length === 0) {
    throw Error("Can't find user");
  };
  try {
    return await dbAccessFunctions.update(usersCollection, {email: query.email}, {subscribedAssociations: query.subscribedAssociations})
  } catch {
    throw Error("Error when trying to update");
  }
}

export default {
  findUserByEmail,
  serviceRegister,
  serviceGetUser,
  serviceDeleteUser,
  serviceLogin,
  serviceUpdateUserAssociations
};