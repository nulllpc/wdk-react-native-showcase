import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useWalletManager } from '@tetherto/wdk-react-native-core'
import { ActionCard } from '@/components/ActionCard'
import { FeatureLayout } from '@/components/FeatureLayout'
import { ConsoleOutput } from '@/components/ConsoleOutput'
import { useStartupWallet } from '@/components/StartupWalletProvider'
import { colors } from '@/constants/colors'

export default function ManageAccountScreen() {
  const startupWallet = useStartupWallet()
  const {
    createWallet,
    unlock,
    restoreWallet,
    createTemporaryWallet,
    deleteWallet,
    getMnemonic,
    wallets,
    activeWalletId,
    status
  } = useWalletManager()

  return (
    <FeatureLayout
      title='Wallet Management'
      description='Create, import, and manage your wallets. The app also boots a temporary startup wallet for Spark testing.'
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Wallet Status</Text>
        <ConsoleOutput
          data={{
            activeWalletId: activeWalletId || 'None',
            status,
            availableWallets: wallets,
            startupWallet: {
              label: startupWallet.label,
              status: startupWallet.status,
              sparkAddress: startupWallet.sparkAddress || 'Not derived',
              mnemonic: startupWallet.mnemonic,
              isTemporary: startupWallet.isTemporary,
              error: startupWallet.error
            }
          }}
        />
      </View>

      <ActionCard
        title='Create New Wallet'
        description='Generates a new seed phrase and saves it securely (requires biometrics).'
        fields={[
          {
            id: 'walletId',
            type: 'text',
            label: 'Wallet ID (Email)',
            placeholder: 'user@example.com'
          }
        ]}
        action={async ({ walletId }) => {
          await createWallet(walletId)
          return { success: true, message: `Wallet ${walletId} created` }
        }}
        actionLabel='Create Wallet'
      />

      <ActionCard
        title='Unlock Wallet'
        description='Unlock the active wallet to load network managers and enable operations.'
        fields={[
          {
            id: 'walletId',
            type: 'text',
            label: 'Wallet ID (optional)',
            placeholder: 'user@example.com'
          }
        ]}
        action={async ({ walletId }) => {
          await unlock(walletId || undefined)
          return { success: true, message: `Wallet unlocked` }
        }}
        actionLabel='Unlock'
      />

      <ActionCard
        title='Import from Mnemonic'
        description='Restore a wallet using a 12 or 24 word seed phrase.'
        fields={[
          {
            id: 'walletId',
            type: 'text',
            label: 'Wallet ID (Email)',
            placeholder: 'user@example.com'
          },
          {
            id: 'mnemonic',
            type: 'json',
            label: 'Seed Phrase',
            placeholder: 'word1 word2 ... word12'
          }
        ]}
        action={async ({ walletId, mnemonic }) => {
          const id = await restoreWallet(mnemonic, walletId)
          return { success: true, message: `Wallet ${id} imported` }
        }}
        actionLabel='Import Wallet'
      />

      <ActionCard
        title='Create Temporary Wallet'
        description='Create a throwaway wallet for testing (not saved to storage).'
        fields={[]}
        action={async () => {
          await createTemporaryWallet()
          return { success: true, message: 'Temporary wallet active' }
        }}
        actionLabel='Create Temp Wallet'
      />

      <ActionCard
        title='Reveal Mnemonic'
        description='Decrypt and show the seed phrase for a wallet.'
        fields={[
          {
            id: 'walletId',
            type: 'text',
            label: 'Wallet ID',
            placeholder: 'user@example.com (Optional if active)'
          }
        ]}
        action={async ({ walletId }) => {
          // If walletId is empty string (default from form), pass undefined to let hook use active wallet if supported,
          // or rely on user input. The hook signature usually requires it if not implicit.
          // Based on user request "getMnemonic requires a walletId", we pass it.
          const phrase = await getMnemonic(walletId || undefined)
          return { mnemonic: phrase }
        }}
        actionLabel='Reveal Phrase'
      />

      <ActionCard
        title='Delete Wallet'
        description='Permanently remove a wallet from secure storage.'
        fields={[
          {
            id: 'walletId',
            type: 'text',
            label: 'Wallet ID to Delete',
            placeholder: 'user@example.com'
          }
        ]}
        action={async ({ walletId }) => {
          await deleteWallet(walletId)
          return { success: true, message: `Wallet ${walletId} deleted` }
        }}
        actionLabel='Delete Wallet'
      />
    </FeatureLayout>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8
  }
})
