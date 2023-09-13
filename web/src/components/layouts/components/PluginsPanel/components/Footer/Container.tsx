import React from "react";
import {LayoutPropsType} from "../../../../types";

const Container: React.FC<LayoutPropsType> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}

Container.displayName = "FooterContainer"

export default Container