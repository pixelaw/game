export const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function isValidArray(input: any): input is any[] {
  return Array.isArray(input) && input != null;
}

export function getFirstComponentByType(entities: any[] | null | undefined, typename: string): any | null {
  if (!isValidArray(entities)) return null;

  for (const entity of entities) {
    if (isValidArray(entity?.node.components)) {
      const foundComponent = entity.node.components.find((comp: any) => comp.__typename === typename);
      if (foundComponent) return foundComponent;
    }
  }

  return null;
}

type Node = { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'Color', x?: any | null, y?: any | null, r?: any | null, g?: any | null, b?: any | null } | { __typename: 'ColorCount', x?: any | null, y?: any | null, count?: any | null } | { __typename?: 'Game' } | { __typename: 'Owner', x?: any | null, y?: any | null, address?: any | null } | { __typename?: 'Permission' } | { __typename: 'PixelType', x?: any | null, y?: any | null, name?: any | null } | { __typename?: 'Player' } | { __typename?: 'Text', x?: any | null, y?: any | null, string?: any | null } | { __typename: 'Timestamp', x?: any | null, y?: any | null, created_at?: any | null, updated_at?: any | null } | null> | null }

export function getFirstComponentInNode(node:  Node, typename: string): any | null {
  return node?.components?.find((comp: any) => comp.__typename === typename) ?? null

}

export function extractAndCleanKey(entities?: any[] | null | undefined): string | null {
  if (!isValidArray(entities) || !entities[0]?.keys) return null;

  return entities[0].keys.replace(/,/g, '');
}

export const convertToHexadecimal = (n: number) => n.toString(16)
export const prefixString = (prefix: string, base: string) => `${prefix}${base}`
export const convertToHexadecimalAndLeadWithOx = (n: number) => prefixString('0x', convertToHexadecimal(n))
export const convertToDecimal = (hexadecimalString: string) => {
  const n = hexadecimalString.replace("0x", "")
  return parseInt(n, 16);
}
