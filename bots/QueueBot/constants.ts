import { Provider } from 'starknet'
import getEnv from '../utils/getEnv'

export const QUEUE_STARTED_KEY_EVENT = "0x13716a499dcdd9a2bb8983f7de44be73f75b491244ab6b6ada5cc9307d74b1d"
export const QUEUE_FINISHED_KEY_EVENT = "0x243d9f213226470c700d9c1553b7b30b3f5fb9718fe4d2dba8ae3853fd10986"
export const PROCESS_QUEUE_SYSTEM_IN_HEX = "0x70726f636573735f71756575655f73797374656d"
export const RPC_URL = getEnv("RPC_URL", "http://0.0.0.0:5050")

export const provider = new Provider({
  rpc: {
    nodeUrl: RPC_URL
  }
})
