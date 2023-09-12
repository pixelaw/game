import FullImageLayout from "./FullImageLayout";
import React from "react";
import {LayoutPropsType} from "./types";
import TransparentWrapper from "./components/TransparentWrapper";

const TransparentImageLayout: React.FC<LayoutPropsType> = ({children}) => {
  return (
    <FullImageLayout>
      <TransparentWrapper>
        <div>
          {children}
        </div>
      </TransparentWrapper>
    </FullImageLayout>
  )
}

export default TransparentImageLayout