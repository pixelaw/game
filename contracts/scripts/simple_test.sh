#!/bin/bash
set -euo pipefail
source scripts/update_accounts.sh
source scripts/update_contracts.sh

pushd $(dirname "$0")/..




# Player 1 Spawn pixel 1,1
#sozo execute $CORE_ACTIONS spawn_pixel \
#  --private-key $ACCOUNT_2_PRIVATE_KEY \
#  --account-address $ACCOUNT_2_ADDRESS \
#  -c 1,1,1,482670636660,0

sleep 0.1

# Player 1 put_color pixel 1,1
sozo execute $PAINT_ACTIONS put_color \
  --private-key $ACCOUNT_2_PRIVATE_KEY \
  --account-address $ACCOUNT_2_ADDRESS \
  -c 1,1,1,1,0,0,0

