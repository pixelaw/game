import React from "react";

import DrawingPanel from "./DrawingPanel";
import {ColorResult, CompactPicker} from 'react-color';
import { useAtom } from 'jotai'
import { colorAtom } from '@/global/states'
import Plugin from "@/components/Plugin";
import { useDojo } from '@/DojoContext'

type Account = {
  address: string,
  active: boolean
}

const Main = () => {

  const [isLoading, setIsLoading] = React.useState(true)

  const urlParams = new URLSearchParams(window.location.search)
  const accountParam = urlParams.get('account')

  const {
    account: {
      create,
      list,
      select,
      isDeploying,
      account
    }
  } = useDojo()

  const accounts = list()
  const index = parseInt(accountParam ?? '0')
  const selectedAccount = accounts[index - 1] as Account | undefined
  const hasAccount = !!selectedAccount
  const isAlreadySelected = account.address === selectedAccount?.address

  React.useEffect(() => {
    if (isDeploying) return
    if (isNaN(index)) return
    if (hasAccount) return
    create()
  }, [setIsLoading, hasAccount, index, isDeploying, create])

  React.useEffect(() => {
    if (isAlreadySelected) {
      setIsLoading(false)
      return
    }
    if (!hasAccount) return
    select(selectedAccount?.address ?? '')
  }, [setIsLoading, isAlreadySelected, selectedAccount?.address, select, hasAccount])

  const [color, setColor] = useAtom(colorAtom)

  function changeColor(color: ColorResult) {
    setColor(color.hex)
  }

  return (
      <React.Fragment>
          {
              !isLoading ?
                  <>
                      <div className={'m-sm'}>
                          <div>
                              <DrawingPanel/>
                          </div>

                          <div className="fixed bottom-5 right-20">
                              <CompactPicker color={color} onChangeComplete={changeColor}/>
                          </div>
                      </div>

                      <Plugin/>
                  </>
                  :
                  <div className={'fixed top-0 bottom-0 left-0 w-full bg-brand-body z-40 flex-center'}>
                      <div
                          className={'w-16 h-16 border-t-2 border-brand-violetAccent border-solid rounded-full animate-spin'}/>
                      <h2 className={'text-lg uppercase font-silkscreen text-brand-violetAccent ml-xs'}>Loading...</h2>
                  </div>
          }
      </React.Fragment>
  )
};

export default Main;
