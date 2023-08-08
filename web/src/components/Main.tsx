import React from "react";

import DrawingPanel from "./DrawingPanel";
import {ColorResult, CompactPicker} from 'react-color';
import {useAtom} from "jotai";
import {colorAtom} from "../global/states";

const Main = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  const [color, setColor] = useAtom(colorAtom)

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  function changeColor(color: ColorResult) {
    setColor(color.hex)
  }
  
  return (
    <div>
      <div>
        <DrawingPanel />
      </div>
      <div className="fixed bottom-4 right-4">
        {isMounted && <CompactPicker color={color} onChangeComplete={changeColor}/>}
      </div>
    </div>
  )
};

export default Main;