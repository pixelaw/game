import React from "react";
import Row from "./Row";
import Container from "./Container";

type PropsType = {
  coordinates: {
    x: number,
    y: number
  },
  type?: string,
  owner?: string,
  collapsed?: boolean
}
const Footer: React.FC<PropsType> = ({ coordinates, type, owner, collapsed}) => {
  if (collapsed) {
    return (
      <Container>
        <Row label={'x'} value={coordinates.x.toString()} />
        <Row label={'y'} value={coordinates.y.toString()} />
      </Container>
    )
  } else {
    return (
      <Container>
        <Row label={'Cooridnates'} value={`${coordinates.x}, ${coordinates.y}`} />
        <Row label={'Type'} value={type ?? 'null'} />
        <Row label={'Owner'} value={owner ?? 'n/a'} />
      </Container>
    )
  }
}

Footer.displayName = "PluginPanelFooter"

export default Object.assign(
  Footer,
  {
    Container,
    Row
  }
)