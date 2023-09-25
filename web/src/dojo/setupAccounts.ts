import { streamToString } from '@/global/utils'

type Account = {
  address: string,
  balance: string,
  class_hash: string,
  private_key: string,
  public_key: string
}

const getAccounts = async () => {
  const result = await fetch("/api/accounts")
  const stream = result.body
  if (!stream) return [] as Account[]
  return JSON.parse(await streamToString(stream)) as Account[]
}

const setupAccounts = async () => {
  const accounts = await getAccounts()
  const masterAccount = accounts[0]
  return {
    address: masterAccount.address,
    classHash: masterAccount.class_hash,
    privateKey: masterAccount.private_key
  }
}

export default setupAccounts
