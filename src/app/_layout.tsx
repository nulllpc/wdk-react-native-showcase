import {
  DarkTheme,
  ThemeProvider as NavigationThemeProvider
} from '@react-navigation/native'
import {
  AppStatus,
  WdkAppProvider,
  useWdkApp
} from '@tetherto/wdk-react-native-core'
import { ThemeProvider } from '@tetherto/wdk-uikit-react-native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { Toaster } from 'sonner-native'
import { colors } from '../constants/colors'
import wdkConfigs from '../config/chain'
import {
  StartupWalletProvider,
  useStartupWallet
} from '../components/StartupWalletProvider'
// @ts-ignore - generated worklet bundle
import bundle from '../../.wdk-bundle/wdk-worklet.bundle.js'

SplashScreen.preventAutoHideAsync()

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background
  }
}

const SplashHandler = ({ children }: { children: React.ReactNode }) => {
  const { isInitializing, status } = useWdkApp()
  const startupWallet = useStartupWallet()

  useEffect(() => {
    const canHideSplash =
      !isInitializing &&
      (status === AppStatus.READY ||
        status === AppStatus.ERROR ||
        startupWallet.status === 'ready' ||
        startupWallet.status === 'error' ||
        startupWallet.status === 'skipped')

    if (canHideSplash) {
      SplashScreen.hideAsync()
    }
  }, [isInitializing, startupWallet.status, status])

  return <>{children}</>
}

export default function RootLayout() {
  return (
    <WdkAppProvider wdkConfigs={wdkConfigs} bundle={{ bundle }}>
      <StartupWalletProvider>
        <SplashHandler>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider
              defaultMode='dark'
              brandConfig={{
                primaryColor: colors.primary
              }}
            >
              <NavigationThemeProvider value={CustomDarkTheme}>
                <View style={{ flex: 1, backgroundColor: colors.background }}>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: colors.background }
                    }}
                  />
                  <StatusBar style='light' />
                </View>
              </NavigationThemeProvider>
              <Toaster
                offset={90}
                toastOptions={{
                  style: {
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border
                  },
                  titleStyle: { color: colors.text },
                  descriptionStyle: { color: colors.text }
                }}
              />
            </ThemeProvider>
          </GestureHandlerRootView>
        </SplashHandler>
      </StartupWalletProvider>
    </WdkAppProvider>
  )
}
