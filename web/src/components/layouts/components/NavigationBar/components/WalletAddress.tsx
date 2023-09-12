import React from "react";

const PLACEHOLDER = "0x0000000000000000000000000000000000000000"

type PropsType = {
  address?: string
}

const WalletAddress: React.FC<PropsType & Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">> = (props) => {
  const { address } = props
  const defaultAddress = (address ?? PLACEHOLDER)
  const shortenedAddress = defaultAddress.substring(0, 6) + '...' + defaultAddress.substring(defaultAddress.length - 4)
  const handleOnClick = () => navigator.clipboard.writeText(address ?? PLACEHOLDER)

  return (
    <div {...props} onClick={handleOnClick}>
      <span className={'font-primary text-white border border-address py-[0.5em] px-[1em] text-center cursor-copy'}>
      { shortenedAddress }
      </span>
    </div>
  )
}

WalletAddress.displayName = "NavigationBarWalletAddress"

export default WalletAddress