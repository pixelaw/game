import React from 'react'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ButtonGroup from '@/components/ui/ButtonGroup'

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
  const id = `enum-group-${label}`
  return (
    <>
      <Label htmlFor={id} className={'capitalize'}>{label}</Label>
      <ButtonGroup
        id={id}
        options={variants.map(variant => { return { label: variant.name, value: variant.value }})}
        value={value}
        onChange={(newValue) => {
          if (onChange) onChange(newValue ?? 0)
        }}
      />
    </>
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
