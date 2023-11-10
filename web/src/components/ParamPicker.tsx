import React from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type ParamDefinition = {
  name: string,
  type: 'number' | 'string' | 'enum',
  variants?: {name: string, value: number}[],
  structDefinition?: Record<string, any>
}

type PropsType = {
  value: Record<string, any>,
  onChange: (newValue: Record<string, any>) => void,
  params: ParamDefinition[],
  onSubmit?: () => void,
  open?: boolean,
  onOpenChange?: (open: boolean) => void
}

const ParamPicker: React.FC<PropsType> = ({ value, onChange, params, onSubmit, open, onOpenChange }) => {
  const hasOnSubmit = !!onSubmit
  console.log(hasOnSubmit)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div>
          {params.map((param) => {

            switch (param.type) {
              case 'enum':
                return (
                  <label key={param.name}>
                    {param.name}
                    <select
                      className={'text-black'}
                      value={value[param.name]}
                      onChange={(e) => onChange({...value, [param.name]: e.target.value})}
                    >
                      {param.variants?.map((variant) => (
                        <option key={variant.value} value={variant.value}>{variant.name}</option>
                      ))}
                    </select>
                  </label>
                );
              case 'number':
                return (
                  <label key={param.name}>
                    {param.name}
                    <input
                      type="number"
                      value={value[param.name]}
                      onChange={(e) => onChange({...value, [param.name]: Number(e.target.value)})}
                    />
                  </label>
                );
              case 'string':
                return (
                  <label key={param.name}>
                    {param.name}
                    <input
                      type="text"
                      value={value[param.name]}
                      onChange={(e) => onChange({...value, [param.name]: e.target.value})}
                    />
                  </label>
                );
              default:
                return null;
            }
          })}
        </div>
        {hasOnSubmit && (
          <DialogFooter className={'justify-center'}>
            <Button onClick={onSubmit}>Submit Transaction</Button>
          </DialogFooter>
        )}

      </DialogContent>

    </Dialog>
  );
}

export default ParamPicker;
