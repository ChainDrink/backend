const { ApiPromise, WsProvider } = require("@polkadot/api");
const { Abi } = require('@polkadot/api-contract');
const fs = require('fs').promises;
const { execSync } = require("child_process");
const { Web3 } = require('web3');

const CONTRACT_ADDRESS = "5GDu9hdL8UyCELNa3vKSZSyFyS5cjUNkvK8Zy9wRRZUJEbHR";
const CONTRACT_ADDRESS_EVM = "0x9417b2a92979C2aD4d5Ee074bd1217f6b6D6E330";

async function main() {
  const api = await ApiPromise.create({ provider: new WsProvider("wss://ws.test.azero.dev") });
  const abiInk = new Abi(await fs.readFile("./abi.json", "utf-8"));
  const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.testnet.mantle.xyz"));
  const abi = JSON.parse(await fs.readFile("./abi-evm.json", "utf-8"));
  const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS_EVM);
  let latestCheck = await web3.eth.getBlockNumber()
  let latestHash = ""

  api.query.system.events((events) => {
    events.forEach(async ({event, _}) => {
      if(api.events.contracts.ContractEmitted.is(event)) {
        const [contract, data] = event.data
        if(contract.toString() === CONTRACT_ADDRESS) {
          console.log("AlephZero")
          const decodedEvent = abiInk.decodeEvent(data)
          console.log(decodedEvent.args[0].toString())
          console.log(decodedEvent.args[1].toString())
          execSync("ls", {stdio: 'inherit'})
        }
      }
      let currentCheck = await web3.eth.getBlockNumber()
      if(latestCheck !== currentCheck ) {
        const events = await contract.getPastEvents("Received", {fromBlock: latestCheck, toBlock: currentCheck})
        latestCheck = currentCheck
        events.forEach((event) => {
          if(latestHash !== event.transactionHash) {
            console.log("Mantle")
            console.log(web3.utils.fromWei(event.returnValues.value, "ether"))
            console.log(event.returnValues.value)
            execSync("ls", {stdio: 'inherit'})
            latestHash = event.transactionHash
          }
        })
      }
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
