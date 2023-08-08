import useGraphql from "./useGraphql";
import {gql} from "graphql-request";
import {PixelEntity} from "../../global/types";
import {
  convertEntityToPixelEntity,
  QueryReturn,
} from './usePixelEntity'
import {BLOCK_TIME} from "../../global/constants";

export const QUERY_KEY = ["paintedPixels"]

const query = gql`
query PixelEntity {
  entities(keys: ["%"] componentName: "Color" limit: ${64 * 64}) {
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
const PAINTED = "0x7061696e74"
const usePaintedPixels = () => {
  return useGraphql<QueryReturn, PixelEntity[]>(
    QUERY_KEY,
    query,
    undefined,
    ({entities}) => entities
      .map(convertEntityToPixelEntity)
      .filter(entity => entity.pixelType === PAINTED),
    {
      refetchInterval: BLOCK_TIME,
      initialData: []
    }
  )
}

export default usePaintedPixels