import { Pixel } from './types'
import { createClient } from '../lib/graphql'
import { DEFAULT_COLOR, GET_ENTITIES } from './constants'
import convertToDecimal from '../utils/convertToDecimal'
import getEnv from '../utils/getEnv'

const TORII_URI = getEnv<string>("TORII_URI", 'http://0.0.0.0:8080/graphql')

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
  keys: string,
  models: Array<ColorComponent | TextComponent | {__typename: undefined}>
}

const getState: () => Promise<Pixel[]> = async () => {
  try {
    const response = await client.query({
      query: GET_ENTITIES,
      fetchPolicy: "network-only"
    });

    // Process the response here
    const entities: EntityGqlReturn[] =  response.data.entities.edges
      .filter((edge) => edge.node.keys.split("/").filter(k => !!k).length === 2)
      .map((edge) => {
        return {
          ...edge.node,
          keys: edge.node.keys.split("/").filter(k => !!k)
        }
      });

    return entities.map(entity => {
      let colorModel: ColorComponent | undefined;
      let textModel: TextComponent | undefined;

      for (const component of entity.models) {
        if (component.__typename === 'Color') {
          colorModel = component as ColorComponent;
        } else if (component.__typename === 'Text') {
          textModel = component as TextComponent;
        }
      }

      return {
        x: convertToDecimal(entity.keys[0]),
        y: convertToDecimal(entity.keys[1]),
        color: colorModel ? {
          r: colorModel.r,
          g: colorModel.g,
          b: colorModel.b
        } : DEFAULT_COLOR,
        text: textModel?.string ?? ''
      }
    })
  } catch (error) {
    throw new Error("Could not get Entities", error)
  }
}

export default getState
