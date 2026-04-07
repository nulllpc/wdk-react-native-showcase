import { type SparkWalletConfig } from '@tetherto/wdk-wallet-spark'
import type { WdkConfigs } from '@tetherto/wdk-react-native-core'

const wdkConfigs: WdkConfigs<SparkWalletConfig> = {
  networks: {
    spark: {
      blockchain: 'spark',
      config: {
        network: 'REGTEST'
      }
    }
  }
}

export default wdkConfigs
