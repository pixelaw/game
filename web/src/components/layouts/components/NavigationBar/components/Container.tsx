import React from "react";

type PropsType = {
  children: React.ReactNode
}
const Container: React.FC<PropsType> = ({ children }) => {
  return (
    <div className={'w-full bg-nav-bar p-[0.5em] grid grid-cols-3 sticky top-0'}>
      { children }
    </div>
  )
}

Container.displayName = "NavigationBarContainer"

export default Container