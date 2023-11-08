import fs from 'fs'
import { setupNetwork } from './dojo/setupNetwork'
import dotenv from 'dotenv'
import { KatanaAccount, Pixel } from './types'
import { Account, shortString} from 'starknet'
import manifest from '../contracts/target/dev/manifest.copy.json'
import { getContractByName } from '../../../reference/dojo.js/packages/core/src'

dotenv.config()

// Read the file synchronously
const accounts: KatanaAccount[] = JSON.parse(fs.readFileSync('../contracts/target/dev/accounts.json', 'utf-8'));

const QUEUED_EVENTKEY = '0x1c4fa7f75d1ea055adccbf8f86b75224181a3036d672762185805e0b999ad65';



(async function () {
  // const abi = manifest.abi
  // const abi_filtered =abi.filter(item => item.type !== 'interface');
  // manifest['abi'] = abi_filtered

  const setup = await setupNetwork(manifest, process.env.NODE_URL!, process.env.TORII_URL!)

  // const coreActionsAddress = manifest.contracts.filter(c => c.name == "actions")[0].address

  const signer = new Account(setup.provider.provider, accounts[0].address, accounts[0].private_key)

  // const tx = await setup.execute(signer, 'snake_actions', 'move', [
  //   1 // Snake id
  // ])

  const tx = await setup.execute(signer, 'snake_actions', 'interact', [
    0, // for_player
    0, // for_system
    1,2, // y
    0x161616, // color
    1 // Direction
  ])

  const receipt: any = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100})

  const queuedEvent = receipt.events.filter(e => e.keys.includes(QUEUED_EVENTKEY))[0]
  console.log(queuedEvent)
  await setup.execute(signer, 'actions', 'process_queue', queuedEvent.data)

  // const pixel: Pixel = await setup.getPixel(1,2);
  // console.log(pixel)



})()



