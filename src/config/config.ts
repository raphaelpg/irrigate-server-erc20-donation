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
  owner: "0x4b500a6b5D0b36Ad13faB14431FD30eE75f143F3",
  erc20: "0xFc9Be8FaA7f189c8730B9cc36b521Ab8596C581A",
  irrigate: "0x70181EdFe0399fe5F36B6aA0016b2F166F1b3990",
}

const PARAMS = {
  fee: 100,
  erc20Name: "dai"
}

const config = {
  server: SERVER,
  mongo: MONGO,
  jwt: JWT,
  web3: WEB3,
  params: PARAMS
}

export default config;