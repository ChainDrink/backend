const { ApiPromise, WsProvider } = require("@polkadot/api");
const { Abi } = require('@polkadot/api-contract');
const fs = require('fs').promises;
const { execSync } = require("child_process");

const CONTRACT_ADDRESS = "5GDu9hdL8UyCELNa3vKSZSyFyS5cjUNkvK8Zy9wRRZUJEbHR";

async function main() {
  const provider = new WsProvider("wss://ws.test.azero.dev");
  const api = await ApiPromise.create({ provider: provider });
  const abi = new Abi(await fs.readFile("./abi.json", "utf-8"));
  
  api.query.system.events((events) => {
    events.forEach(({event, _}) => {
      if(api.events.contracts.ContractEmitted.is(event)) {
        const [contract, data] = event.data
        if(contract.toString() === CONTRACT_ADDRESS) {
          const decodedEvent = abi.decodeEvent(data)
          console.log(decodedEvent.args[0].toString())
          console.log(decodedEvent.args[1].toString())
          execSync("ls", {stdio: 'inherit'})
        }
      }
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
