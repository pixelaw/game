type NetworkType = {
  label: string,
  img: string
}

type WalletType = {
  label: string,
  img: string,
  networks: NetworkType[]
}

export const networks: Record<string, NetworkType> = {
  Ethereum: {
    label: 'Ethereum',
    img: '/assets/icon_ethereum.png'
  },
  Binance: {
    label: 'Binance',
    img: '/assets/icon_binance.png'
  },
  Polygon: {
    label: 'Polygon',
    img: '/assets/icon_polygon.png'
  },
  Starknet: {
    label: 'Starknet',
    img: '/assets/icon_starknet.png'
  }
}

export const wallets: Record<string, WalletType> = {
  Metamask: {
    label: 'Metamask',
    img: '/assets/icon_metamask.png',
    networks: [networks.Ethereum, networks.Binance, networks.Polygon, networks.Starknet]
  },
  Coinbase: {
    label: 'Coinbase',
    img: '/assets/icon_coinbase.png',
    networks: [networks.Ethereum, networks.Binance, networks.Polygon, networks.Starknet]
  },
  Trust: {
    label: 'Trust',
    img: '/assets/icon_trust.png',
    networks: [networks.Ethereum, networks.Binance, networks.Polygon, networks.Starknet]
  }
}

