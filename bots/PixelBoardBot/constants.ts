import { gql } from 'graphql-tag'

const NUMBER_OF_PIXELS = 250_000

export const GET_ENTITIES = gql`query getEntities {
  entities(keys: ["%"] first: ${NUMBER_OF_PIXELS}) {
    edges {
      node {
        keys
        components {
          ... on Color {
            __typename
            x
            y
            r
            g
            b
          }
          ... on Text {
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

export const DEFAULT_COLOR = {
  r: 0,
  g: 0,
  b: 0
}
