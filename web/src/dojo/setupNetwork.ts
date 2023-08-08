import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { number } from 'starknet';

import {Providers, Query, SyncWorker} from "@dojoengine/core";
import { Account, ec } from "starknet";


const accountIndex = new URLSearchParams(document.location.search).get("account")??1
console.log("Using account index ", accountIndex)


export const KATANA_ACCOUNT_ADDRESS = import.meta.env[`VITE_KATANA_ACCOUNT_${accountIndex}_ADDRESS`]
export const KATANA_ACCOUNT_PRIVATEKEY = import.meta.env[`VITE_KATANA_ACCOUNT_${accountIndex}_PRIVATEKEY`]

export const WORLD_ADDRESS = import.meta.env.VITE_WORLD_ADDRESS
export const EVENT_KEY = import.meta.env.VITE_EVENT_KEY

const RPC_URL = import.meta.env.VITE_RPC_URL ?? 'http://127.0.0.1:5050'


export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {

    const contractComponents = defineContractComponents(world);

    const provider = new Providers.RPCProvider(WORLD_ADDRESS, RPC_URL);

    const signer = new Account(provider.sequencerProvider, KATANA_ACCOUNT_ADDRESS, ec.getKeyPair(KATANA_ACCOUNT_PRIVATEKEY))

    const syncWorker = new SyncWorker(provider, contractComponents, EVENT_KEY);

    return {
        contractComponents,
        provider,
        signer,
        execute: async (system: string, call_data: number.BigNumberish[]) => {
            console.log(`executing ${system} with call_data:`, call_data)
            return provider.execute(signer, system, call_data)
        },
        entity: async (component: string, query: Query) => provider.entity(component, query),
        entities: async (component: string, partition: string, length: number) => provider.entities(component, partition, length),
        world,
        syncWorker
    };
}