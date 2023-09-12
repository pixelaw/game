import LogoDefault from "../../../../shared/Logo";
import {Link, LinkProps} from "react-router-dom";
import React from "react";
const Logo: React.FC<Omit<LinkProps, "to">> = (props) => {
  return (
    <Link {...props} to={'/pixels'}>
      <LogoDefault className={'w-[8em]'}/>
    </Link>
  )
}

Logo.displayName = "NavigationBarLogo"
export default Logo