export default interface ITx {
  _id?: string,
  date?: string,
  associationName: string,
  associationAddress: string,
  amount: string,
  donorName?: string,
  donorEmail?: string,
  donorAddress: string,
  status: string,
};