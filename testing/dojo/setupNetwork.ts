import { defineContractComponents } from "../generated/contractComponents";
import { getSdk } from "../generated/graphql";
import { world } from "./world";
import { RPCProvider, Query } from "@dojoengine/core";
import { Account, num } from "starknet";
import { GraphQLClient } from "graphql-request";
import { Pixel } from '../types'

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork(manifest: any, nodeAddress: string, toriiAddress: string) {

    // Create a new RPCProvider instance.
    const provider = new RPCProvider(
        manifest.world.address,
        manifest,
      nodeAddress
    );

    // Return the setup object.
    return {
        provider,
        world,

        // Define contract components for the world.
        contractComponents: defineContractComponents(world),

        // Define the graph SDK instance.
        graphSdk: () => getSdk(new GraphQLClient(toriiAddress)),

        // Execute function.
        execute: async (
            signer: Account,
            contract: string,
            system: string,
            call_data: num.BigNumberish[]
        ) => {
            return provider.execute(signer, contract, system, call_data);
        },

        // Entity query function.
        entity: async (component: string, query: Query) => {
            return provider.entity(component, query);
        },

        // Entities query function.
        entities: async (component: string, partition: number) => {
            return provider.entities(component, partition);
        },

        getPixel: async(x: number, y: number) : Promise<Pixel> => {
          const result = await provider.contract.entity(
            'Pixel',  //
            [x,y],
            0,
            10,
            [64,64, 251,251,32,251,251,64]
          )

          return {
            x,
            y,
            created_at: parseInt(result[0]),
            updated_at: parseInt(result[1]),
            alert: num.toHex(result[2]),
            app: num.toHex(result[3]),
            color: num.toHex(result[4]),
            owner: num.toHex(result[5]),
            text: num.toHex(result[6]),
            timestamp: result[7],

          }
        }


    };
}
