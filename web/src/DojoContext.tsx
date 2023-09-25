import { createContext, ReactNode, useContext, useMemo } from "react";
import { SetupResult } from "./dojo/setup";
import { Account, RpcProvider } from "starknet";
import { useBurner } from "@dojoengine/create-burner";
import { PUBLIC_NODE_URL } from '@/global/constants'

type EternumContext = {
  setup: SetupResult;
  account: {
    create: () => void;
    list: () => any[];
    get: (id: string) => any;
    select: (id: string) => void;
    account: Account;
    masterAccount: Account;
    isDeploying: boolean;
    clear: () => void;
  };
}

const DojoContext = createContext<EternumContext | null>(null);

type Props = {
  children: ReactNode;
  value: SetupResult;
  master: {
    address: string,
    classHash: string,
    privateKey: string
  }
};

export const DojoProvider = ({ children, value, master }: Props) => {

  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error("DojoProvider can only be used once");

  const provider = useMemo(
    () =>
      new RpcProvider({
        nodeUrl: PUBLIC_NODE_URL,
      }),
    [],
  );

  const masterAddress = master.address;
  const privateKey = master.privateKey;
  const masterAccount = useMemo(
    () => new Account(provider, masterAddress, privateKey),
    [provider, masterAddress, privateKey],
  );

  const { create, list, get, account, select, isDeploying, clear } = useBurner({
    masterAccount: masterAccount,
    accountClassHash: master.classHash,
    nodeUrl: PUBLIC_NODE_URL
  });

  const selectedAccount = useMemo(() => {
    return account || masterAccount;
  }, [account])

  const contextValue: EternumContext = {
    setup: value,    // the provided setup
    account: {
      create,        // create a new account
      list,          // list all accounts
      get,           // get an account by id
      select,        // select an account by id
      account: selectedAccount,       // the selected account
      masterAccount, // the master account
      isDeploying,   // is the account being deployed
      clear
    }
  }

  return <DojoContext.Provider value={contextValue}>{children}</DojoContext.Provider>;
};

export const useDojo = () => {
  const value = useContext(DojoContext);
  if (!value) throw new Error("Must be used within a DojoProvider");
  return value;
};
