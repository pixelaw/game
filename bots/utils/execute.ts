// based on dojo execute command
import fetchApi from './fetchApi'

let worldAddress = ''

const execute = async (account, system, call_data) => {
  if (!worldAddress) {
    worldAddress = await fetchApi<string>("world-address", "string")
  }

  console.log(`executing ${system} with args: ${call_data.join(", ")}`)

  try {
    const nonce = await account?.getNonce()
    return await account?.execute(
      {
        contractAddress: worldAddress,
        entrypoint: 'execute',
        calldata: [system, call_data.length, ...call_data]
      },
      undefined,
      {
        nonce: nonce,
        maxFee: 0 // TODO: Update
      }
    );
  } catch (error) {
    console.error('could not execute:', error)
    throw error;
  }
}

export default execute
