import React from "react";
import Container from "./components/Container"
import NavigationBar from "./components/NavigationBar"
import {LayoutPropsType} from "./types";
import Notifications from "./components/Notifications";


const GamePlayLayout: React.FC<LayoutPropsType> = ({ children }) => {
  return (
    <Container>
      <NavigationBar />
      <Notifications />
      {children}
    </Container>
  )
}

GamePlayLayout.displayName = 'GamePlayLayout'

export default GamePlayLayout