import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider, Query, } from "@dojoengine/core";
import { Account, num } from "starknet";
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '@/generated/graphql';
import { streamToString } from '@/global/utils'

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

const getWorldAddress = async () => {
  const result = await fetch("/api/world-address")
  const stream = result.body
  if (!stream) return ''
  return streamToString(stream)
}

const getManifest: () => Promise<{ contracts: { name: string, address: string }[]}> = async () => {
  const result = await  fetch("/world/manifest.json")
  const stream = result.body
  if (!stream) return {}
  return JSON.parse( await streamToString(stream))
}

export async function setupNetwork() {
  // Extract environment variables for better readability.
  const { VITE_PUBLIC_NODE_URL, VITE_PUBLIC_TORII } = import.meta.env;

  const worldAddress = await getWorldAddress()

  const manifest = await getManifest()

  const getContractByName = (name: string) => {
    return manifest.contracts.find((contract) => contract.name === name);
  }



  // Create a new RPCProvider instance.
  const provider = new RPCProvider(worldAddress, VITE_PUBLIC_NODE_URL);

  // Utility function to get the SDK.
  const createGraphSdk = () => getSdk(new GraphQLClient(VITE_PUBLIC_TORII));

  // Return the setup object.
  return {
    provider,
    world,

    // Define contract components for the world.
    contractComponents: defineContractComponents(world),

    // Define the graph SDK instance.
    graphSdk: createGraphSdk(),

    // Execute function.
    execute: async (signer: Account, contract: string, system: string, call_data: num.BigNumberish[]) => {
      return provider.execute(signer, getContractByName(contract)?.address || "", system, call_data);
    },

    // Entity query function.
    entity: async (component: string, query: Query) => {
      return provider.entity(component, query);
    },

    // Entities query function.
    entities: async (component: string, partition: number) => {
      return provider.entities(component, partition);
    },

    // Call function.
    call: async (selector: string, call_data: num.BigNumberish[]) => {
      return provider.call(selector, call_data);
    },
  };
}
