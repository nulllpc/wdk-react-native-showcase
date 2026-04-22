import { AppAsset } from '@/entities/AppAsset';
import type { AppAssetConfig } from '@/entities/AppAsset';

/**
 * Main Application Asset Configurations
 * This list is used to instantiate AppAsset objects that are used throughout the app.
 */
export const tokenAssetConfigs: AppAssetConfig[] = [
  {
    id: 'ethereum-native',
    network: 'ethereum',
    isNative: true,
    address: null,
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logo: require('../../assets/images/chains/ethereum-eth-logo.png')
  },
  {
    id: 'ethereum-usdt',
    network: 'ethereum',
    isNative: false,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logo: require('../../assets/images/tokens/tether-usdt-logo.png')
  },
  {
    id: 'ethereum-xaut',
    network: 'ethereum',
    isNative: false,
    address: '0x68749665FF8D2d112Fa859AA293F07A622782F38',
    symbol: 'XAUT',
    name: 'Tether Gold',
    decimals: 6,
    logo: require('../../assets/images/tokens/tether-xaut-logo.png')
  },
  {
    id: 'ethereum-usat',
    network: 'ethereum',
    isNative: false,
    address: '0x07041776f5007aca2a54844f50503a18a72a8b68',
    symbol: 'USAT',
    name: 'Tether USAT',
    decimals: 6
  }
];

const TOKENS: AppAsset[] = AppAsset.fromConfigs(tokenAssetConfigs);

/**
 * Export a map for easy asset lookup by their unique ID.
 * e.g. tokenMap.get('ethereum-usdt')
 */
export const TOKEN_MAP: Map<string, AppAsset> = new Map(
  TOKENS.map(t => [t.getId(), t])
);
