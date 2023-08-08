export const ROCK = 1
export const PAPER = 2
export const SCISSORS = 3

export const commits = ['NONE', 'Rock', 'Paper', 'Scissors']

export const GAME_ID = 0

export const STATE_IDLE = 1
export const STATE_COMMIT_1 = 2

export const STATE_COMMIT_2 = 3

export const STATE_REVEAL_1 = 4

export const STATE_DECIDED = 5

export const GAME_MAX_DURATION = 20000;

export const TORII_END_POINT = import.meta.env.VITE_TORII_ENDPOINT ?? 'http://localhost:8080/'

export const BLOCK_TIME = 1_000