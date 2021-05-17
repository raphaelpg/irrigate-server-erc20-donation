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
  owner: "0xFBBe1C2f37f3213580a24c186dC7b8a2B7D6591D",
  erc20: "0x43BaAcd357a01B714355A8D48b29eE8BFc92deCB",
  irrigate: "0xb6C1cc2da31Fcf349C125E7367dc0F0E4459aA64",
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