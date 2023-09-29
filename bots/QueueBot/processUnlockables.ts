import fetchApi from '../utils/fetchApi'
import { Account } from 'starknet'
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

// wrapper for the execute function and solely for processing the queue
const processQueue = async (id, execution, args) => {
  const callData = [
    id,
    execution,
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
  return execute(signer, PROCESS_QUEUE_SYSTEM_IN_HEX, callData)
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
    await processQueue(unlockable.id, unlockable.execution, unlockable.args)
  }
}

export default processUnlockables
