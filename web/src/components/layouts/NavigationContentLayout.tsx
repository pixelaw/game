import React from "react";
import {LayoutPropsType} from "./types";
import NavigationBar from "./components/NavigationBar";
import Container from "./components/Container";
import Notifications from "./components/Notifications";

const NavigationContentLayout: React.FC<LayoutPropsType> = ({children}) => {
  return (

    <Container bgImage>
      <div className={'w-full h-[100vh] bg-tran'}>
        <NavigationBar />
        <Notifications />
        <div>
          {children}
        </div>
      </div>
    </Container>
  )
}

export default NavigationContentLayout