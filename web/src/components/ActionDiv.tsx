import React from "react";
import {clsx} from "clsx";

type Action = {
  img: string,
  label: string,
  onClick?: () => void
}

type PropsType = {
  label: string,
  actions: Action[],
  defaultMessage?: string,
  selected?: string,
  className?: string
}

const ActionDiv: React.FC<PropsType> = ({ label, actions, defaultMessage, selected, className }) => {
  return (
    <div className={className}>
      <div className={'text-label font-primary text-left p-[0.5em] text-lg'}>{ label }</div>
      <div className={'bg-action-div flex px-[10em] py-[2.5em] gap-20 rounded-sm shadow-actionDiv justify-center'}>
        { actions.length === 0 && (defaultMessage ?? 'No actions to display')}
        { actions.map(({ img, label, onClick}) => (
          <div key={label} onClick={onClick}>
            <div>
              <img src={img} className={clsx([
                'rounded-full',
                {'border-2 border-label': selected === label}
              ])} />
            </div>
            <div className={clsx([
              'font-subtitle',
              'text-center',
              {'text-white': selected !== label },
              {'text-label': selected === label }
            ])}>{ label }</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActionDiv