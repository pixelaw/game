import React from "react";
import {clsx} from "clsx";

type PropsType = {
  value?: number,
  onZoomChange?: (value: number) => void,
  min?: number,
  max?: number
  steps?: number
}

enum ZoomType {
  Add,
  Subtract
}

const ZoomControl: React.FC<PropsType & React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  const { min, max, className } = props
  const steps = props?.steps ?? 1
  const [currentValue, setCurrentValue] = React.useState(100)
  const value = props?.value ?? currentValue
  const handleChange = (type: ZoomType) => {
    let newValue = value
    if (type === ZoomType.Add) {
      newValue += steps
      if (max) {
        if (max < newValue) newValue = max
      }
    } else {
      newValue -= steps
      if (min) {
        if (min > newValue) newValue = min
      }
    }
    setCurrentValue(newValue)
    if (props?.onZoomChange) props.onZoomChange(newValue)
  }

  return (
    <div {...props} className={clsx([
      'h-full',
      className
    ])}>
      <div {...props} className={clsx([
        'flex justify-center bg-black gap-10 rounded-full w-[15em] p-[0.25em] h-full'
      ])}>
        <span className={'align-middle'}>
          <img
            className={clsx([
              'h-[0.25em] inline-block',
              {'cursor-not-allowed': min ? min >= value : false},
              {'cursor-pointer': min ? min < value : true }
            ])}
            src={'/assets/icon_minus.svg'}
            alt={'zoom out'}
            onClick={() => handleChange(ZoomType.Subtract)}
          />
        </span>
        <span className={'text-pixel-blue font-primary inline-block align-middle'}> {value}% </span>
        <span className={'align-middle'}>
          <img
            className={clsx([
              'h-[1.5em] inline-block',
              {'cursor-not-allowed': max ? max <= value : false},
              {'cursor-pointer': max ? max > value : true }
            ])}
            src={'/assets/icon_plus.svg'}
            alt={'zoom in'}
            onClick={() => handleChange(ZoomType.Add)}
          />
        </span>
      </div>
    </div>
  )
}

ZoomControl.displayName = "NavigationBarZoomControl"

export default ZoomControl