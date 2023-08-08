import {useComponentValue} from "@dojoengine/react";
import {Utils} from "@dojoengine/core";
import {useDojo} from "../../../DojoContext";
import {GAME_ID, STATE_COMMIT_1, STATE_COMMIT_2, STATE_REVEAL_1} from "../../../global/constants";

const useGameStatus = () => {
  const {
    components: { Game }
  } = useDojo()

  const game = useComponentValue(Game, Utils.getEntityIdFromKeys([BigInt(GAME_ID)]))
  const gameStatus = game?.state ?? 0

  if (gameStatus < STATE_COMMIT_1) return 'Idle, Waiting for your commit'
  else if (gameStatus === STATE_COMMIT_1) {
    const player1Hash = game?.player1_hash ?? 0

    if (player1Hash) return 'Playing, Waiting for Player2'
    else return 'Playing, Waiting for Player1'
  } else if (gameStatus === STATE_COMMIT_2) return 'Playing, Waiting for reveal'
    else if (gameStatus === STATE_REVEAL_1) {
    const player1Commit = game?.player1_commit ?? 0

    if (player1Commit) return 'Playing, Waiting for Player2 Reveal'
    else return 'Playing, Waiting for Player1 Reveal'
  }
    else return 'Done, Waiting for reset'
}

export default useGameStatus