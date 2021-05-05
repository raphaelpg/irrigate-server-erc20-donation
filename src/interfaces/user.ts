export default interface IUser {
  _id?: string,
  creationDate?: string,
  email: string,
  password: string,
  subscribedAssociations: string[],
  role: string
};