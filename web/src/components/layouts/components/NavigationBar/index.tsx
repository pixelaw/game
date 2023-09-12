import NavigationBarLogo from "./components/Logo";
import NavigationBarZoomControl from "./components/ZoomControl";
import NavigationBarWalletAddress from "./components/WalletAddress";
import NavigationBarContainer from './components/Container'
import React from "react";

const NavigationBar = () => {
  const [zoom, setZoom] = React.useState(100)

  const handleZoomChange = (newValue: number) => {
    setZoom(newValue)
  }

  return (
    <NavigationBarContainer>
      <NavigationBarLogo className={"ml-[2em]"}/>
      <div >
        <NavigationBarZoomControl
          max={100}
          min={25}
          steps={5}
          value={zoom}
          onZoomChange={handleZoomChange}
          className={'flex justify-center'}
        />
      </div>
      <NavigationBarWalletAddress className={'flex justify-end'} />
    </NavigationBarContainer>
  )
}

NavigationBar.displayName = "NavigationBar"

export default Object.assign(
  NavigationBar,
  {
    Container: NavigationBarContainer,
    Logo: NavigationBarLogo,
    WalletAddress: NavigationBarWalletAddress,
    ZoomControl: NavigationBarZoomControl
  }
)