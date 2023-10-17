#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

# make sure to include this
# this allows to have named variables for $WORLD_ADDRESS, $PRIVATE_KEY, $ACCOUNT_ADDRESS, $RPC_URL
# systems are also named variables (their name being the name of the system)
# -> e.g. $move_system points to its contract address
for arg in "$@"
do
    eval "${arg}"
done

# make sure all components/systems are deployed
COMPONENTS=("App" "AppName" "CoreActionsModel" "Color" "Owner" "Permission" "Text" "Timestamp" "ColorCount" "PixelType" "Game" "Player" "NeedsAttention")

for component in ${COMPONENTS[@]}; do
    sleep 0.1
    sozo auth writer $component $core_actions --world $WORLD_ADDRESS --private-key $PRIVATE_KEY --account-address $ACCOUNT_ADDRESS
done

for component in ${COMPONENTS[@]}; do
    sleep 0.1
    sozo auth writer $component $paint_actions --world $WORLD_ADDRESS --private-key $PRIVATE_KEY --account-address $ACCOUNT_ADDRESS
done

# initialize systems
sleep 0.1
sozo execute $core_actions init --private-key $PRIVATE_KEY --account-address $ACCOUNT_ADDRESS
sleep 0.1
sozo execute $paint_actions init --private-key $PRIVATE_KEY --account-address $ACCOUNT_ADDRESS


echo "Default authorizations have been successfully set."
