import { type EvmWalletConfig } from '@tetherto/wdk-wallet-evm'
import { type BtcWalletConfig } from '@tetherto/wdk-wallet-btc'
import { type SparkWalletConfig } from '@tetherto/wdk-wallet-spark'
import { type TronGasfreeWalletConfig } from '@tetherto/wdk-wallet-tron-gasfree'
import type { WdkConfigs } from '@tetherto/wdk-react-native-core'

export enum NETWORK_NAME {
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum',
  TRON = 'tron',
  SPARK = 'spark'
}

export const wdkConfigs: WdkConfigs<
  EvmWalletConfig | BtcWalletConfig | SparkWalletConfig | TronGasfreeWalletConfig
> = {
  networks: {
    [NETWORK_NAME.BITCOIN]: {
      blockchain: NETWORK_NAME.BITCOIN,
      config: {
        network: 'bitcoin',
        client: {
          type: 'blockbook-http',
          clientConfig: {
            url: 'blockbook endpoint'
          }
        }
      }
    },
    [NETWORK_NAME.ETHEREUM]: {
      blockchain: NETWORK_NAME.ETHEREUM,
      config: {
        provider: 'https://sepolia.gateway.tenderly.co',
        transferMaxFee: 10000000
      }
    },
    [NETWORK_NAME.SPARK]: {
      blockchain: NETWORK_NAME.SPARK,
      config: {
        network: 'MAINNET'
      }
    },
    [NETWORK_NAME.TRON]: {
      blockchain: NETWORK_NAME.TRON,
      config: {
        chainId: 1,
        provider: '',
        gasFreeProvider: '',
        gasFreeApiKey: '',
        gasFreeApiSecret: '',
        serviceProvider: '',
        verifyingContract: ''
      }
    }
  }
}

export default wdkConfigs
