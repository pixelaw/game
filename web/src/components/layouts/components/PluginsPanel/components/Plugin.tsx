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
  collapsed?: boolean,

}

const Plugin: React.FC<PropsType> = ({ icon, label, status, collapsed }) => {
  const isLoading = status === Status.Loading
  const isDisabled = status === Status.Disabled
  const isIdle = status === Status.Idle
  const isActive = status === Status.Active

  return (
    <div>
      <span className={clsx([
        'font-emoji',
        'text-white',
        {'text-black': isDisabled}
      ])}>
        { icon }
        {isActive && (
          <span>Loading</span>
        )}
      </span>
      {collapsed !== true && <span className={clsx([
        'font-default',
        {'text-pixel-blue': isIdle},
        {'text-white': isLoading}
      ])}>
        {label}
      </span>}
    </div>
  )
}

export default Plugin