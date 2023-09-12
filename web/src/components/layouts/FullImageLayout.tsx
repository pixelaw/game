import React from "react";
import Container from "./components/Container"
import {LayoutPropsType} from "./types";

const FullImageLayout: React.FC<LayoutPropsType> = ({ children }) => {
  return (
    <Container bgImage centeredContent>
      {children}
    </Container>
  )
}

FullImageLayout.displayName = 'FullImageLayout'

export default FullImageLayout