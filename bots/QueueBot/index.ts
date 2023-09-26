import indexEvents from './indexEvents'
import processUnlockables from './processUnlockables'
import { BLOCK_TIME } from './constants'


async function loop() {
  await indexEvents()
  await processUnlockables()
  setTimeout(loop, BLOCK_TIME);
}

async function start () {
  console.info("QueueBot is starting")
  await loop()
}

export default start
