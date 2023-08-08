import React from "react";
import {useComponentValue} from "@dojoengine/react";
import {Utils} from "@dojoengine/core";
import {useDojo} from "../../../DojoContext";
import {commits, GAME_ID, STATE_DECIDED} from "../../../global/constants";

const useLogs = () => {
    const [battleLogs, setBattleLogs] = React.useState<Array<{selectedChoice: string, player: string}>>([]);
    const [totalGames, setTotalGames] = React.useState<number>(0)
    const [resetting, setResetting] = React.useState(false)

    const {
        components: { Game },
        systemCalls: { reset }
    } = useDojo()

    const game = useComponentValue(Game, Utils.getEntityIdFromKeys([BigInt(GAME_ID)]))

    const gameWinner = game?.winner ?? 0
    const gameStatus = game?.state ?? 0
    const winningChoice = (gameWinner === 1 ? game?.player1_commit : game?.player2_commit) ?? 0
    const selectedChoice = commits[winningChoice]

    React.useEffect(() => {
        if (gameStatus !== STATE_DECIDED || resetting) return
        setResetting(true)
        setTotalGames(prevTotalGames => prevTotalGames + 1)
        setBattleLogs(prevBattleLogs => {
            return [
              ...prevBattleLogs,
                {
                    player: gameWinner.toString(),
                    selectedChoice
                }
            ]
        })
        setTimeout(() => {
            reset(GAME_ID).then(() => setResetting(false))
        }, 5_000)
    }, [reset, resetting, selectedChoice, gameStatus, gameWinner])

    return {
        battleLogs,
        totalGames,
    }
}

export default useLogs