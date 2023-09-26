import { Pixel } from './types'
import { createClient } from '../lib/graphql'
import { DEFAULT_COLOR, GET_ENTITIES } from './constants'
import convertToDecimal from '../utils/convertToDecimal'

// TODO: need to check if this will work over the internet. if not, replace this
const TORII_URI = 'http://0.0.0.0:8080'

const client = createClient(TORII_URI)

type ColorComponent = {
  x: number,
  y: number,
  r: number,
  g: number,
  b: number
  __typename: 'Color'
}

type TextComponent = {
  x: number,
  y: number,
  string: string
  __typename: 'Text'
}

type EntityGqlReturn = {
  __typename: 'Entity',
  keys: string[],
  components: Array<ColorComponent | TextComponent | {__typename: undefined}>
}

const getState: () => Promise<Pixel[]> = async () => {
  console.info("getting state from torii")
  try {
    const response = await client.query({
      query: GET_ENTITIES,
    });

    // Process the response here
    const entities: EntityGqlReturn[] =  response.data.entities.edges
      .filter((edge) => edge.node.keys.length === 2)
      .map((edge) => edge.node);

    return entities.map(entity => {
      const colorComponent = entity.components.find(component => component?.__typename === 'Color') as ColorComponent | undefined
      const textComponent = entity.components.find(component => component?.__typename === 'Text') as TextComponent | undefined
      return {
        x: convertToDecimal(entity.keys[0]),
        y: convertToDecimal(entity.keys[1]),
        color: colorComponent ? {
          r: colorComponent.r,
          g: colorComponent.g,
          b: colorComponent.b
        } : DEFAULT_COLOR,
        text: textComponent?.string ?? ''
      }
    })
  } catch (error) {
    throw new Error("Could not get Entities", error)
  }
}

export default getState
