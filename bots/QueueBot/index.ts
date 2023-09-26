import indexEvents from './indexEvents'
import processUnlockables from './processUnlockables'

const config = {
  refreshRate: 1_000
}

async function loop() {
  await indexEvents()
  await processUnlockables()
  setTimeout(loop, config.refreshRate);
}

async function start () {
  console.info("QueueBot is starting")
  await loop()
}

export default start
