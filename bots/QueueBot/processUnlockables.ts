import fetchApi from '../utils/fetchApi'
import { Account, num } from 'starknet'
import execute from '../utils/execute'
import { PROCESS_QUEUE_SYSTEM_IN_HEX, provider } from './constants'
import { eventsToProcess } from './memory'

let botPrivateKey = ''
let botAddress = ''

type AccountType = {
  address: string,
  balance: string,
  class_hash: string,
  private_key: string,
  public_key: string
}

// TODO: get this from manifest.json
const CORE_ACTIONS_ADDRESS = "0x2a231ad0f533463e2835ce2d6278948ffb5f9268c0f4cb79fecf5dc5d1476dc"
const CORE_ACTIONS_SELECTOR = "process_queue"

// wrapper for the execute function and solely for processing the queue
const processQueue = async (id: number, system: string, selector: string, args: num.BigNumberish[]) => {
  console.log(`executing ${system}-${selector} with args: ${args.join(", ")}`)
  const callData = [
    id,
    system,
    selector,
    args.length,
    ...args
  ]

  if (!botAddress || !botPrivateKey) {
    const accounts = await fetchApi<AccountType[]>("accounts", "json")
    const master = accounts[0]
    botAddress = master.address
    botPrivateKey = master.private_key
  }

  const signer = new Account(provider, botAddress, botPrivateKey)
  return execute(signer, CORE_ACTIONS_ADDRESS, CORE_ACTIONS_SELECTOR, callData)
}

// actual queue processing
const processUnlockables = async () => {
  if (!Object.values(eventsToProcess).length) return
  const currentBlock = await provider.getBlock("latest")
  const blockTimeStamp = currentBlock.timestamp * 1000
  const unlockables = Object.values(eventsToProcess)
    .filter(eventToProcess => blockTimeStamp >= eventToProcess.id)
    .sort((eventToProcessA, eventToProcessB) => eventToProcessA.id - eventToProcessB.id)

  if (!unlockables.length) return

  for (const unlockable of unlockables) {
    await processQueue(unlockable.id, unlockable.system, unlockable.selector, unlockable.args)
  }
}

export default processUnlockables
