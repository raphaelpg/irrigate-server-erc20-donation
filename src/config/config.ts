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
  owner: "0xB5cE99d342c647Af04167995D227FB50D0817d8e",
  dai: "0x3F091E16800A45b530A89E1DF98a4045b19189F0",
  irrigate: "0xeA5137f6f4e64b931d800df9ffEc23679F3495E0",
}

const config = {
  server: SERVER,
  mongo: MONGO,
  jwt: JWT,
  web3: WEB3,
}

export default config;