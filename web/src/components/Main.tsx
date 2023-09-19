import React from "react";

import DrawingPanel from "./DrawingPanel";
import {ColorResult, CompactPicker} from 'react-color';
import {useAtom} from "jotai";
import {colorAtom} from "../global/states";
import Plugin from "@/components/Plugin";

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
      <React.Fragment>
          {
              isMounted ?
                  <>
                      <div className={'m-sm'}>
                          <div>
                              <DrawingPanel/>
                          </div>

                          <div className="fixed bottom-5 right-20">
                              <CompactPicker color={color} onChangeComplete={changeColor}/>
                          </div>
                      </div>

                      <Plugin/>
                  </>
                  :
                  <div className={'fixed top-0 bottom-0 left-0 w-full bg-brand-body z-40 flex-center'}>
                      <div
                          className={'w-16 h-16 border-t-2 border-brand-violetAccent border-solid rounded-full animate-spin'}/>
                      <h2 className={'text-lg uppercase font-silkscreen text-brand-violetAccent ml-xs'}>Loading...</h2>
                  </div>
          }
      </React.Fragment>
  )
};

export default Main;
