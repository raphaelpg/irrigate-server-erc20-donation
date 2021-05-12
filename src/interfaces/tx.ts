export default interface ITx {
  _id?: string,
  date?: string,
  donationId: string,
  associationName: string,
  associationAddress: string,
  amount: string,
  donorName?: string,
  donorEmail?: string,
  donorAddress: string,
  fundsStatus: string,
  transferStatus: string,
  fee: string,
  currency: string
};