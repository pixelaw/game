import React from "react";
import {clsx} from "clsx";

export enum Status {
  Active,
  Loading,
  Idle,
  Disabled
}

type PropsType = {
  icon: string,
  label: string,
  status: Status
  collapsed?: boolean
}

const Plugin: React.FC<PropsType> = ({ icon, label, status, collapsed }) => {
  return (
    <div>
      <span>
        <img src={icon} alt={`icon for plugin ${label}`} />
      </span>
      <span className={clsx([
        'font-default',
        {'text-pixel-blue': status === Status.Idle},
      ])}>
        {label}
      </span>
    </div>
  )
}

export default Plugin