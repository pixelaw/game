import { gql } from 'graphql-tag'
import getEnv from '../utils/getEnv'
import hexToRGB from '../utils/hexToRGB'

const NUMBER_OF_PIXELS = 250_000

export const GET_ENTITIES = gql`query getEntities {
  entities(keys: ["%"] first: ${NUMBER_OF_PIXELS}) {
    edges {
      node {
        keys
        models {
          ... on Color {
            __typename
            x
            y
            r
            g
            b
          }
          ... on Text {
            __typename
            x
            y
            string
          }
        }
      }
    }
  }
}
`;

export const DEFAULT_COLOR = hexToRGB(getEnv<string>('DEFAULT_PIXEL_COLOR', "#2f1643"))
