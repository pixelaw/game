import React from 'react';

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
  onSubmit?: () => void
}

const ParamPicker: React.FC<PropsType> = ({ value, onChange, params, onSubmit }) => {
  const hasOnSubmit = !!onSubmit
  return (
    <>
      <div>
        {params.map((param) => {

          switch (param.type) {
            case 'enum':
              return (
                <select
                  className={'text-black'}
                  key={param.name}
                  value={value[param.name]}
                  onChange={(e) => onChange({...value, [param.name]: e.target.value})}
                >
                  {param.variants?.map((variant) => (
                    <option key={variant.value} value={variant.value}>{variant.name}</option>
                  ))}
                </select>
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
      {hasOnSubmit && <button onClick={onSubmit}>Submit Transaction</button>}
    </>
  );
}

export default ParamPicker;
