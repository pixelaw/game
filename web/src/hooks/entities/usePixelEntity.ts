import {gql} from "graphql-request";
import useGraphql from "./useGraphql";
import {
  ColorComponent, ColorCountComponent,
  OwnerComponent,
  PixelEntity,
  PixelTypeComponent,
  PositionComponent,
  TimestampComponent
} from "../../global/types";
import {BigNumber} from "ethers";

const convertToHexadecimal = (n: number) => n.toString(16)
const prefixString = (prefix: string, base: string) => `${prefix}${base}`
const toKey = (n: number) => prefixString('0x', convertToHexadecimal(n))

const query = gql`
query PixelEntity($x: String!, $y: String!) {
  entities(keys: [$x, $y]) {
    id
    components {
      __typename
      ... on Position {
        x
        y
      }
      ... on Color {
        r
        g
        b
      }
      ... on PixelType {
        name
      }
      ... on Timestamp {
        created_at
        updated_at
      }
      ... on Owner {
        address
      }
      ... on ColorCount {
        count
      }
    }
  }
}
`

type EntityType = {
  id: string,
  components: [OwnerComponent, PositionComponent, PixelTypeComponent, TimestampComponent, ColorComponent, ColorCountComponent]
}

export type QueryReturn = {
  entities: EntityType[]
}

export const convertEntityToPixelEntity = (entity: EntityType) => {
  let ownerComponent: OwnerComponent | undefined = undefined
  let positionComponent: PositionComponent | undefined = undefined
  let pixelTypeComponent: PixelTypeComponent | undefined = undefined
  let timestampComponent: TimestampComponent | undefined = undefined
  let colorComponent: ColorComponent | undefined = undefined
  let colorCountComponent: ColorCountComponent | undefined = undefined

  for (const component of entity.components) {
    switch (component.__typename) {
      case "Color": {
        colorComponent = component
        break
      }
      case "ColorCount": {
        colorCountComponent = component
        break
      }
      case "Owner": {
        ownerComponent = component
        break
      }
      case "PixelType": {
        pixelTypeComponent = component
        break
      }
      case "Position": {
        positionComponent = component
        break
      }
      case "Timestamp": {
        timestampComponent = component
        break
      }
    }
  }

  return {
    id: entity.id,
    owner: ownerComponent?.address ?? '',
    position: positionComponent ? { x: positionComponent.x, y: positionComponent.y } : undefined,
    pixelType: pixelTypeComponent?.name,
    createdAt: timestampComponent?.created_at,
    updatedAt: timestampComponent?.updated_at,
    color: colorComponent ? {
      r: colorComponent.r,
      g: colorComponent.g,
      b: colorComponent.b
    } : undefined,
    colorCount: Number(BigNumber.from(colorCountComponent?.count ?? 0))
  }
}

const convertQueryReturnToPixelEntity = ({entities}: QueryReturn) => {
  const [res] = entities
  if (!res) return undefined
  return convertEntityToPixelEntity(res)
}

const usePixelEntity = ([x, y]: [number, number]) => {
  const xKey = toKey(x)
  const yKey = toKey(y)

  return useGraphql<QueryReturn, PixelEntity | undefined>(
    ['pixelEntity', x, y],
    query,
    { x: xKey, y: yKey },
    convertQueryReturnToPixelEntity
  )

}

export default usePixelEntity