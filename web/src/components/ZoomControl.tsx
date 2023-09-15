import React from "react";
import {clsx} from "clsx";
import {Button} from "@/components/ui/button";

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

  const [, setZoom] = React.useState(100)

  const handleZoomChange = (newValue: number) => {
    setZoom(newValue)
  }


  const {min, max, className} = props
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
    handleZoomChange(newValue)
  }

  return (
      <div
          className={clsx(
              [
                'h-[50px]',
                className
              ])}
          {...props}
      >
        <div
            className={clsx(
                [
                  'h-full w-[15em]',
                  'flex-center gap-x-10',
                  'bg-black rounded-full p-[0.25em] '
                ])}
        >

          <Button
              variant={'icon'}
              size={'icon'}
              onClick={() => handleChange(ZoomType.Subtract)}
              disabled={min ? min >= value : false}
              className={'font-emoji font-bold text-brand-violetAccent text-[34px]'}
          >
            &#8722;
          </Button>

          <span className={'text-brand-skyblue text-base font-silkscreen text-center'}> {value}% </span>

          <Button
              variant={'icon'}
              size={'icon'}
              onClick={() => handleChange(ZoomType.Add)}
              disabled={max ? max <= value : false}
              className={'font-emoji font-bold text-brand-violetAccent text-[34px]'}
          >
            &#43;
          </Button>
        </div>
      </div>
  )
}

ZoomControl.displayName = "NavigationBarZoomControl"

export default ZoomControl
