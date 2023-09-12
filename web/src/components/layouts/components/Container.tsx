import React from "react";
import {clsx} from "clsx";

type PropsType = {
  centeredContent?: boolean
  bgImage?: boolean,
  children?: React.ReactNode
}

const Container: React.FC<PropsType & React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { className, bgImage, children, centeredContent } = props
  return (
    <div
      {...props}
      className={clsx(
        [
          'transparent w-full h-[100vh] absolute top-[0]',
          { 'bg-home bg-cover bg-center': !!bgImage },
          { 'bg-default': !bgImage },
          { 'items-center flex': !!centeredContent },
          className
        ]
      )}>
      {children}
    </div>
  )
}

Container.displayName= "Container"

export default Container