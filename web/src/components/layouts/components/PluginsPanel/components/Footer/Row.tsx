import React from "react";

type PropsType = {
  label: string,
  value: string
}

const Row: React.FC<PropsType> = ({label, value}) => {
  return (
    <div>
      <span>{label}:</span>
      <span> {value}</span>
    </div>
  )
}

Row.displayName = "FooterRow"

export default Row