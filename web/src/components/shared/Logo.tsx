import React, {ImgHTMLAttributes} from "react";

const Logo: React.FC<Omit<ImgHTMLAttributes<never>, "src">> = (props) => {
  return <img src={"/assets/icon.png"} alt={"pixeLAW logo"} {...props} />
}

export default Logo