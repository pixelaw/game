// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { overridableComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";


export type ClientComponents = ReturnType<typeof createClientComponents>;

// SetComponent has a hard time setting overridable components, so not overriding them here and using
// underscored values in useEntities
export function createClientComponents({ contractComponents }: SetupNetworkResult) {
    return {
        ...contractComponents,
      _Color: contractComponents.Color,
      _Owner: contractComponents.Owner,
      _PixelType: contractComponents.PixelType,
      _NeedsAttention: contractComponents.NeedsAttention,
      Color: overridableComponent(contractComponents.Color),
      Owner: overridableComponent(contractComponents.Owner),
      PixelType: overridableComponent(contractComponents.PixelType),
      NeedsAttention: overridableComponent(contractComponents.NeedsAttention)
    };
}
