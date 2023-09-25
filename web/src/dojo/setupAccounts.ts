import { streamToString } from '@/global/utils'
import { RpcProvider } from 'starknet'
import { PUBLIC_NODE_URL } from '@/global/constants'

type Account = {
  address: string,
  balance: string,
  class_hash: string,
  private_key: string,
  public_key: string
}

type Burner = {
  active: boolean,
  deployTx: string,
  privateKey: string,
  publicKey: string
}

const getAccounts = async () => {
  const result = await fetch("/api/accounts")
  const stream = result.body
  if (!stream) return [] as Account[]
  return JSON.parse(await streamToString(stream)) as Account[]
}

const clearUpOldBurners = async () => {
  const burnersStorage = localStorage.getItem("burners")
  if (!burnersStorage) return
  const burners: Record<string, Burner> = JSON.parse(burnersStorage)

  const provider =  new RpcProvider({
    nodeUrl: PUBLIC_NODE_URL,
  })

  const firstBurner = Object.values(burners)[0]
  try {
    await provider.getTransactionReceipt(firstBurner.deployTx)
  } catch (e) {
    localStorage.removeItem("burners")
  }
}

const setupAccounts = async () => {
  const accounts = await getAccounts()
  const masterAccount = accounts[0]
  await clearUpOldBurners()

  return {
    address: masterAccount.address,
    classHash: masterAccount.class_hash,
    privateKey: masterAccount.private_key
  }
}

export default setupAccounts
