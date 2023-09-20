import {Account, Provider} from "starknet";

// for now storing events to process in memory
const eventsToProcess = {}
let lastBlockIndexed = 0

// constants
const QUEUE_STARTED_KEY_EVENT = "0x13716a499dcdd9a2bb8983f7de44be73f75b491244ab6b6ada5cc9307d74b1d"
const QUEUE_FINISHED_KEY_EVENT = "0x243d9f213226470c700d9c1553b7b30b3f5fb9718fe4d2dba8ae3853fd10986"
const PROCESS_QUEUE_SYSTEM_IN_HEX = "0x70726f636573735f71756575655f73797374656d"

const config = {
    rpcUrl: 'http://0.0.0.0:5050',
    blockTime: 1_000,
    botAddress: '0x765149d6bc63271df7b0316537888b81aa021523f9516a05306f10fd36914da',
    botPrivateKey: '0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b',
    worldAddress: '0x59104057c6a88a30bc6e74b945779683196f123964a09483999b0c6e5b87a16'
}

console.info('QueueBot starting...')
console.info(`Configuration - KATANA URL: ${config.rpcUrl}`)

const provider = new Provider({
    rpc: {
        nodeUrl: config.rpcUrl
    }
})

const signer = new Account(provider, config.botAddress, config.botPrivateKey)

// based on dojo execute command
const execute = async (account, system, call_data) => {

    console.log(`executing ${system} with args: ${call_data.join(", ")}`)

    try {
        const nonce = await account?.getNonce()
        const call = await account?.execute(
            {
                contractAddress: config.worldAddress,
                entrypoint: 'execute',
                calldata: [system, call_data.length, ...call_data]
            },
            undefined,
            {
                nonce: nonce,
                maxFee: 0 // TODO: Update
            }
        );
        return call;
    } catch (error) {
        console.error('could not execute:', error)
        throw error;
    }
}

// wrapper for the execute function and solely for processing the queue
const processQueue = async (id, execution, args) => {
    const callData = [
        id,
        execution,
        args.length,
        ...args
    ]
    return execute(signer, PROCESS_QUEUE_SYSTEM_IN_HEX, callData)
}

// something to add to torii
const indexEvents = async () => {
    const currentBlock = await provider.getBlock("latest")

    if (lastBlockIndexed === currentBlock.block_number) return
    console.log(`INDEXING FROM ${lastBlockIndexed} TO ${currentBlock.block_number}`)

    for (let i = lastBlockIndexed; i <= currentBlock.block_number; i++) {
        let blockI = await provider.getBlock(i)
        console.log('indexing block: ', blockI.block_number)
        const receiptPromises = blockI
            .transactions
            .map(txHash => provider.getTransactionReceipt(txHash))

        const receipts = (await Promise.allSettled(receiptPromises)).filter(x => x.status === "fulfilled").map(x => x.value)
        for (const receipt of receipts) {
            const queueStartedEvents = receipt.events.filter(event => event.keys[0] === QUEUE_STARTED_KEY_EVENT)
            const queueFinishedIds = receipt.events
                .filter(event => event.keys[0] === QUEUE_FINISHED_KEY_EVENT)
                .map(event => event.data[0])

            for (const queueStartedEvent of queueStartedEvents) {
                const [id, execution, _, ...args] = queueStartedEvent.data
                if (queueFinishedIds.includes(id)) delete eventsToProcess[id]
                else if (!eventsToProcess[id])  {
                    eventsToProcess[id] = {
                        id: Number(BigInt(id)),
                        execution,
                        args
                    }
                }
            }
            for (const queueFinishedId of queueFinishedIds) {
                delete eventsToProcess[queueFinishedId]
            }
        }

        lastBlockIndexed = i
    }
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

function startBot() {
    indexEvents().then(() => {
        processUnlockables().then(() => {
            setTimeout(startBot, config.blockTime);
        })
    })
}

// Start the initial request
startBot();
