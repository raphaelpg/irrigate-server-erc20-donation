import Web3 from 'web3';
import config from '../config/config';
import daiInterface from '../contracts/Dai.json';
import irrigateInterface from '../contracts/Irrigate.json';

//setup web3
const web3 = new Web3(config.web3.localProvider);

//deploy dai contract
const deployDaiContract = async () => {
  console.log("starting Dai contract local deployment")
  const chainId = await web3.eth.getChainId();
  const dai = await new web3.eth.Contract(daiInterface.abi as any)
  .deploy({ data: daiInterface.bytecode, arguments: [chainId] })
  .send({ gas: 2000000, gasPrice: '30000', from: "0xbe5F73483A54976fCbD117Aa378F91F3bDEF1c62" })
  .on('error', error => { console.log(error) })
  .on('receipt', receipt => {
    console.log("Dai contract successfully deployed at", receipt.contractAddress) // contains the new contract address
  })
  return dai;
};

//deploy irrigate contract
const deployIrrigateContract = async (tokenAddress: string) => {
  console.log("starting Irrigate contract local deployment")
  const irrigate = await new web3.eth.Contract(irrigateInterface.abi as any)
  .deploy({ data: irrigateInterface.bytecode, arguments: [tokenAddress] })
  .send({ gas: 2000000, gasPrice: '30000', from: "0xbe5F73483A54976fCbD117Aa378F91F3bDEF1c62" })
  .on('error', error => { console.log(error) })
  .on('receipt', receipt => {
    console.log("Irrigate contract successfully deployed at", receipt.contractAddress) // contains the new contract address
  })
  return irrigate;
};

//subscribe to dai transfer event
// const subscribeLogEvent = (contract: any, eventName: string) => {
//   const eventJsonInterface = web3.utils._.find(
//     contract._jsonInterface,
//     (o: any) => o.name === eventName && o.type === 'event',
//   )
  
//   const subscription = web3.eth.subscribe('logs', {
//     address: contract.options.address,
//     topics: [eventJsonInterface.signature]
//   }, (error, result) => {
//       if (!error) {
//         const eventObj = web3.eth.abi.decodeLog(
//             eventJsonInterface.inputs,
//             result.data,
//             result.topics.slice(1)
//           )
//         console.log(`New ${eventName}!`, eventObj)
//       }


//   })

//   console.log(`subscribed to event '${eventName}' of contract '${contract.options.address}' `)

// }

// subscribeLogEvent(dai, 'Transfer')


export default {
  deployDaiContract,
  deployIrrigateContract
}