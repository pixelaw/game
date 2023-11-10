import React from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

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

type EnumPickerPropsType = {
  value?: number,
  label: string
  variants: {name: string, value: number}[],
  onChange?: (value: number) => void
}

const EnumPicker: React.FC<EnumPickerPropsType> = ( { label, value, variants, onChange }) => {
  return (
    <Select
      value={value?.toString()}
      onValueChange={(value) => {
        if (onChange) onChange(parseInt(value))
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {variants.map(({value, name}) => (
          <SelectItem value={value.toString()} key={name}>{name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const ParamPicker: React.FC<PropsType> = ({ value, onChange, params, onSubmit, open, onOpenChange }) => {
  const hasOnSubmit = !!onSubmit
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={'p-md'}>
        <div>
          {params.map((param) => {

            switch (param.type) {
              case 'enum':
                return (
                  <EnumPicker
                    key={param.name}
                    value={value[param.name]}
                    label={param.name}
                    variants={param.variants ?? []}
                    onChange={(e) => onChange({...value, [param.name]: e})}
                  />
                );
              case 'number':
                return (
                  <Input
                    key={param.name}
                    type={'number'}
                    placeholder={param.name}
                    value={value[param.name]}
                    onChange={(e) => onChange({...value, [param.name]: Number(e.target.value)})}
                  />
                );
              case 'string':
                return (
                  <Input
                    key={param.name}
                    type={'text'}
                    placeholder={param.name}
                    value={value[param.name]}
                    onChange={(e) => onChange({...value, [param.name]: e.target.value})}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
        {hasOnSubmit && (
          <DialogFooter>
            <Button size={"sm"} onClick={onSubmit}>confirm</Button>
          </DialogFooter>
        )}

      </DialogContent>

    </Dialog>
  );
}

export default ParamPicker;
