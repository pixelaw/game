#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

# export DOJO_WORLD_ADDRESS="0x26065106fa319c3981618e7567480a50132f23932226a51c219ffb8e47daa84";
export DOJO_WORLD_ADDRESS="0x79a3c37167370f03882049edbb291a4c8b79b988835184a18a0695f4dc4fe0c"
# Get the component of a pixel
sozo component entity "$@" 2,2
