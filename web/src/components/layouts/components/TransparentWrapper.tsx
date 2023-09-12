import React from "react";
import {LayoutPropsType} from "../types";

const TransparentWrapper: React.FC<LayoutPropsType> = ({ children }) => {
  return (
    <div className={'text-center w-full h-full justify-center flex bg-tran'}>
      { children }
    </div>
  )
}

export default TransparentWrapper