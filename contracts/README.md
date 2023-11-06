# Paint

## Overview
The Paint App is a collection of functions that allow players to manipulate the color of a Pixel.

## Properties
None, Paint is just behavior.

## Behavior
- public put_color (color)
  - context: position
- both put_fading_color (color)
  - context: position
- public remove_color ()
  - context: position


# Snake

## Overview
It it basically the game "snake", but with Pixels not necessarily available to move on/over. It is a player-initialized instance that coordinates pixel's color and text being overriden and reverted (if allowed).
If hitting an unowned Pixel, the snake will move, if Pixel is owned by player, Snake grows, and if Pixel is not owned but it's App allows Snake, it shrinks. In all other cases, Snake dies.

## Properties
- position
- color
- text
- direction

## Behavior

- public spawn ( color, text, direction )
  - context: position
- public turn ( snake_id, direction )
  - context: player
- private move ( snake_id )



# Rock Paper Scissors

## Overview
Each Pixel can contain an instance of the RPS App, where it holds a commitment (rock, paper or scissors) from player1. Any other player can now "join" and submit their move. Player1 can then reveal, the winner is decided then. Winner gains ownership of the losing RPS pixel. In case of a draw, the pixel is reset.
The App is also tracking score for each Player.

## Global Properties
- player+wins

## Game-based Properties
- player1
- player2

## Behavior
- create (position, player1, commit1)
- join (position, player2, move2)
- finish (position, move1, salt1)
- reset (position)


## General UI considerations
- Selected App
- Click on a pixel
  - Empty -> DEFAULT
  - OwnedByMe -> UPDATE
  - OwnedByOther -> GUEST

rps (ui calls these if rps app selected and rps pixel clicked)
- empty(param_rpsEnumHash)
- notOwned(rpsEnum)
- owned(rpsEnumHash)
- param_rpsEnumHash(rpsEnum)

paint
- empty(color)
- owned(color)
- SCHEDULER: fade(x,y)

snake
- empty(color)
- notOwned()
- owned()
- SCHEDULER: move(id)

# Default
- empty()
- owned()
- 




