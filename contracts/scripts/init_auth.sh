#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

# export DOJO_WORLD_ADDRESS="0x26065106fa319c3981618e7567480a50132f23932226a51c219ffb8e47daa84";
export DOJO_WORLD_ADDRESS="0x45ef1358b4a415bf9551c7233d5cac213d30e47e772be88ef12327210c47429"

# make sure all components/systems are deployed
COMPONENTS=("Color" "Owner" "Permission" "Text" "Timestamp" "ColorCount" "PixelType" "Game" "Player")
SYSTEMS=("spawn_pixel_system" "update_color_system" "update_owner_system" "update_text_system" "update_type_system" "put_color_system" "play_rps_system" "commit" "create" "reset" "reveal")

# check components
for component in ${COMPONENTS[@]}; do
    sozo component entity $component
done

# check systems
for system in ${SYSTEMS[@]}; do
    SYSTEM_OUTPUT=$(sozo system get $system)
    if [[ "$SYSTEM_OUTPUT" == "0x0" ]]; then
        echo "Error: $system is not deployed"
        exit 1
    fi
done

# enable system -> component authorizations
ADD_PIXEL_COMPONENTS=("Color" "Owner" "Permission" "Text" "Timestamp" "ColorCount")
UPDATE_COLOR_SYSTEM=("Color" "Timestamp")
UPDATE_OWNER_SYSTEM=("Owner" "Timestamp")
UPDATE_TEXT_SYSTEM=("Text" "Timestamp")
PUT_COLOR_SYSTEM=("Color" "Timestamp" "ColorCount")
HAS_WRITE_ACCESS_SYSTEM=("Color" "Owner" "Permission" "Text" "Timestamp" "ColorCount" "PixelType")
ALL_COMPONENTS=("289632186226" "341306140018" "379660685143453645500270" "5795978142210944878" "1415936116" "1557123341884594417008" "318453956533960458989172")

for component in ${COMPONENTS[@]}; do
    sozo auth writer $component spawn_pixel_system
done

for component in ${COMPONENTS[@]}; do
    sozo auth writer $component has_write_access_system
done

for component in ${COMPONENTS[@]}; do
    sozo auth writer $component update_color_system
done

for component in ${COMPONENTS[@]}; do
    sozo auth writer $component update_owner_system 
done

for component in ${COMPONENTS[@]}; do
    sozo auth writer $component update_text_system 
done

for component in ${COMPONENTS[@]}; do
    sozo auth writer $component update_type_system 
done

for component in ${COMPONENTS[@]}; do
    sozo auth writer $component put_color_system 
done

# P1="0x03ee9e18edc71a6df30ac3aca2e0b02a198fbce19b7480a63a0d71cbd76652e0"
# P2="0x033c627a3e5213790e246a917770ce23d7e562baa5b4d2917c23b1be6d91961c"


# for component in ${ALL_COMPONENTS[@]}; do
#     sozo execute grant_owner_system -c $P1,$component
#     sozo execute grant_owner_system -c $P2,$component
# done

echo "Default authorizations have been successfully set."
