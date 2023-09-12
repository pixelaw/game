import ActionDiv from "../components/ActionDiv";
import React from "react";
import {wallets} from "../global/config";
import {useNavigate} from "react-router-dom";
import TransparentImageLayout from "../components/layouts/TransparentImageLayout";

const WalletPage = () => {
  const [wallet, setWallet] = React.useState('')
  const [network, setNetwork] = React.useState('')
  const navigate = useNavigate()

  const networks = (wallets[wallet]?.networks ?? []).map((network) => {
    return {
      ...network,
      onClick: () => {
        setNetwork(network.label)
        navigate('/pixels', { replace: true })
      }
    }
  })

  const walletChoices = Object.values(wallets).map((wallet) => {
    return {
      ...wallet,
      onClick: () => {
        setWallet(wallet.label)
        setNetwork('')
      }
    }
  })

  return (
    <TransparentImageLayout>
      <ActionDiv
        label={'Select Wallet'}
        actions={walletChoices}
        selected={wallet}
        defaultMessage={'No wallets to display'}
        className={'mt-[8em] mx-[2em]'}
      />
      {!!wallet && <ActionDiv
          label={'Select Network'}
          actions={networks}
          selected={network}
          defaultMessage={'No networks to display'}
          className={'mt-[4em] mx-[2em]'}
      />}
    </TransparentImageLayout>
  )
}

export default WalletPage