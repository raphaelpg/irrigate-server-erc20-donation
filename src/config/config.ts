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
  mots: process.env.MOTS!,
  provider: "wss://ropsten.infura.io/ws/v3/" + process.env.INFURA_PROJECT_ID,
  // localProvider: "ws://localhost:7545",
  httpProvider: "https://matic-mumbai.chainstacklabs.com",
  wsProvider: "wss://ws-matic-mumbai.chainstacklabs.com",
  owner: "0xE1ed63922d65811Ac2633046763501f16759A085", // Account[0] matching .env mnemonic
  erc20: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F", // Mumbai DAI ERC20 address
  irrigate: "0x24e8bC880dAca5828572Ec9dB122Bd9966FE63be", // Mumbai Irrigate deployed address
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