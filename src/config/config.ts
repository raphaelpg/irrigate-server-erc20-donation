const SERVER = {
  port: process.env.PORT || 8080,
}

const MONGO = {
  uri: process.env.MONGO_URI!,
  user: process.env.MONGO_USER!,
  key: process.env.MONGO_KEY!,
  completeUri: process.env.MONGO_COMPLETE_URI!,
  dbName: process.env.MONGO_DB_NAME!,
  associationsCollection: process.env.MONGO_TEMPORARY_ASSOCIATIONS_COLLECTION!,
  contactMessagesCollection: process.env.MONGO_CONTACT_MESSAGES_COLLECTION!,
  usersCollection: process.env.MONGO_USERS_COLLECTION!,
  txCollection: process.env.MONGO_DONATIONS_COLLECTION!,
}

const JWT = {
  jwtSecret: process.env.JWT_KEY!,
  expirationTimeInSeconds: 600,
}

const WEB3 = {
  provider: "wss://ropsten.infura.io/ws/v3/" + process.env.INFURA_PROJECT_ID,
  localProvider: "ws://localhost:7545",
  owner: "0x0DCE83Efdbb0D67810131020D37fbB9Aa1c5D25E",
  dai: "0x4D3A6e9f0A82Fe301752CB7AC9bE4e8674EF1b62",
  irrigate: "0x9A6E37Ab764CB76204A7BCD092102BD15fA7C250",
}

const PARAMS = {
  fee: 100
}

const config = {
  server: SERVER,
  mongo: MONGO,
  jwt: JWT,
  web3: WEB3,
  params: PARAMS
}

export default config;