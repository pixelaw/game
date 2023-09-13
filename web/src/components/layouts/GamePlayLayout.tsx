import React from "react";
import Container from "./components/Container"
import NavigationBar from "./components/NavigationBar"
import {LayoutPropsType} from "./types";
import Notifications from "./components/Notifications";
import PluginsPanel from "./components/PluginsPanel";


const GamePlayLayout: React.FC<LayoutPropsType> = ({ children }) => {
  return (
    <Container>
      <NavigationBar />
      <Notifications />
      <PluginsPanel />
      {children}
    </Container>
  )
}

GamePlayLayout.displayName = 'GamePlayLayout'

export default GamePlayLayout