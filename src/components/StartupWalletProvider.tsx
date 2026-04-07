import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  AppStatus,
  useWallet,
  useWalletManager,
  useWdkApp
} from '@tetherto/wdk-react-native-core'

export const STARTUP_TEST_WALLET_LABEL = 'Startup Test Wallet'
export const STARTUP_TEST_WALLET_MNEMONIC =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'

type StartupWalletStatus =
  | 'idle'
  | 'bootstrapping'
  | 'ready'
  | 'error'
  | 'skipped'

interface StartupWalletContextValue {
  status: StartupWalletStatus
  label: string
  mnemonic: string
  mnemonicPreview: string
  sparkAddress: string | null
  error: string | null
  isReady: boolean
  isTemporary: boolean
}

const StartupWalletContext = createContext<StartupWalletContextValue | null>(
  null
)

function getMnemonicPreview(mnemonic: string): string {
  const words = mnemonic.trim().split(/\s+/)
  if (words.length < 4) {
    return mnemonic
  }

  return `${words.slice(0, 2).join(' ')} ... ${words.slice(-2).join(' ')}`
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

export function StartupWalletProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { status } = useWdkApp()
  const { createTemporaryWallet } = useWalletManager()
  const { getAddress } = useWallet()
  const [startupWalletStatus, setStartupWalletStatus] =
    useState<StartupWalletStatus>('idle')
  const [sparkAddress, setSparkAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === AppStatus.READY) {
      setStartupWalletStatus((currentStatus) =>
        currentStatus === 'ready' ? currentStatus : 'skipped'
      )
      setSparkAddress(null)
      setError(null)
      return
    }

    if (status !== AppStatus.WORKLET_READY) {
      return
    }

    let cancelled = false

    setStartupWalletStatus('bootstrapping')
    setSparkAddress(null)
    setError(null)

    const bootstrapWallet = async () => {
      try {
        await createTemporaryWallet(STARTUP_TEST_WALLET_MNEMONIC)
        const derivedSparkAddress = await getAddress('spark', 0)

        if (cancelled) {
          return
        }

        setSparkAddress(derivedSparkAddress)
        setStartupWalletStatus('ready')
      } catch (bootstrapError) {
        if (cancelled) {
          return
        }

        setError(getErrorMessage(bootstrapError))
        setStartupWalletStatus('error')
      }
    }

    void bootstrapWallet()

    return () => {
      cancelled = true
    }
  }, [createTemporaryWallet, getAddress, status])

  const value = useMemo<StartupWalletContextValue>(
    () => ({
      status: startupWalletStatus,
      label: STARTUP_TEST_WALLET_LABEL,
      mnemonic: STARTUP_TEST_WALLET_MNEMONIC,
      mnemonicPreview: getMnemonicPreview(STARTUP_TEST_WALLET_MNEMONIC),
      sparkAddress,
      error,
      isReady: startupWalletStatus === 'ready',
      isTemporary: startupWalletStatus !== 'skipped'
    }),
    [error, sparkAddress, startupWalletStatus]
  )

  return (
    <StartupWalletContext.Provider value={value}>
      {children}
    </StartupWalletContext.Provider>
  )
}

export function useStartupWallet() {
  const context = useContext(StartupWalletContext)

  if (!context) {
    throw new Error(
      'useStartupWallet must be used within StartupWalletProvider'
    )
  }

  return context
}
