import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useWallet } from '@tetherto/wdk-react-native-core'
import { ActionCard } from '@/components/ActionCard'
import { FeatureLayout } from '@/components/FeatureLayout'
import { colors } from '@/constants/colors'

export default function SparkToolsScreen() {
  const { getAddress, callAccountMethod } = useWallet()

  return (
    <FeatureLayout
      title='Spark Tools'
      description='Test Spark-specific wallet operations running in the Bare worklet. On app launch, these calls default to a hardcoded temporary wallet.'
    >
      {/* ── Address & Identity ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address & Identity</Text>
      </View>

      <ActionCard
        title='Get Spark Address'
        description='Derive a Spark address for the given account index.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          }
        ]}
        action={async ({ index }) => {
          const address = await getAddress('spark', parseInt(index))
          return { address }
        }}
        actionLabel='Get Address'
      />

      <ActionCard
        title='Get Identity Key (uses decodeSparkAddress)'
        description='Calls getIdentityKey() which internally decodes the Spark address to extract the identity public key. Verifies decodeSparkAddress works in the bundle.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          }
        ]}
        action={async ({ index }) => {
          const identityKey = await callAccountMethod(
            'spark',
            parseInt(index),
            'getIdentityKey'
          )
          return { identityKey }
        }}
        actionLabel='Get Identity Key'
      />

      {/* ── Balance & Deposits ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Balance & Deposits</Text>
      </View>

      <ActionCard
        title='Get Balance'
        description='Query the Spark wallet balance in sats.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          }
        ]}
        action={async ({ index }) => {
          const balance = await callAccountMethod(
            'spark',
            parseInt(index),
            'getBalance'
          )
          return { balanceSats: String(balance) }
        }}
        actionLabel='Get Balance'
      />

      <ActionCard
        title='Get Token Balance'
        description='Query the balance of a specific token on Spark.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'tokenAddress',
            type: 'text',
            label: 'Token Address',
            placeholder: '0x...'
          }
        ]}
        action={async ({ index, tokenAddress }) => {
          const balance = await callAccountMethod(
            'spark',
            parseInt(index),
            'getTokenBalance',
            tokenAddress
          )
          return { tokenAddress, balance: String(balance) }
        }}
        actionLabel='Get Token Balance'
      />

      <ActionCard
        title='Get Static Deposit Address'
        description='Generate a static deposit address for receiving on-chain Bitcoin deposits into Spark.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          }
        ]}
        action={async ({ index }) => {
          const address = await callAccountMethod(
            'spark',
            parseInt(index),
            'getStaticDepositAddress'
          )
          return { depositAddress: address }
        }}
        actionLabel='Get Deposit Address'
      />

      <ActionCard
        title='Get Single-Use Deposit Address'
        description='Generate a one-time deposit address.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          }
        ]}
        action={async ({ index }) => {
          const address = await callAccountMethod(
            'spark',
            parseInt(index),
            'getSingleUseDepositAddress'
          )
          return { depositAddress: address }
        }}
        actionLabel='Get Single-Use Address'
      />

      {/* ── Spark Invoices ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spark Invoices</Text>
      </View>

      <ActionCard
        title='Create Sats Invoice'
        description='Create a Spark invoice to receive sats.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'amountSats',
            type: 'number',
            label: 'Amount (sats)',
            placeholder: '1000'
          }
        ]}
        action={async ({ index, amountSats }) => {
          const invoice = await callAccountMethod(
            'spark',
            parseInt(index),
            'createSparkSatsInvoice',
            { amountSats: parseInt(amountSats) }
          )
          return { invoice }
        }}
        actionLabel='Create Invoice'
      />

      <ActionCard
        title='Create Token Invoice'
        description='Create a Spark invoice to receive tokens.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'tokenAddress',
            type: 'text',
            label: 'Token Address',
            placeholder: '0x...'
          },
          {
            id: 'tokenAmount',
            type: 'text',
            label: 'Token Amount',
            placeholder: '100'
          }
        ]}
        action={async ({ index, tokenAddress, tokenAmount }) => {
          const invoice = await callAccountMethod(
            'spark',
            parseInt(index),
            'createSparkTokensInvoice',
            { tokenAddress, tokenAmount }
          )
          return { invoice }
        }}
        actionLabel='Create Token Invoice'
      />

      <ActionCard
        title='Pay Spark Invoice'
        description='Pay one or more Spark invoices.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'invoiceAddress',
            type: 'text',
            label: 'Invoice Address (Spark address)',
            placeholder: 'sp1...'
          }
        ]}
        action={async ({ index, invoiceAddress }) => {
          const result = await callAccountMethod(
            'spark',
            parseInt(index),
            'paySparkInvoice',
            [{ sparkAddress: invoiceAddress }]
          )
          return result
        }}
        actionLabel='Pay Invoice'
      />

      <ActionCard
        title='Query Spark Invoices'
        description='Look up the status of Spark invoices by their addresses.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'invoiceAddress',
            type: 'text',
            label: 'Invoice Address',
            placeholder: 'sp1...'
          }
        ]}
        action={async ({ index, invoiceAddress }) => {
          const result = await callAccountMethod(
            'spark',
            parseInt(index),
            'getSparkInvoices',
            [invoiceAddress]
          )
          return result
        }}
        actionLabel='Query Invoice'
      />

      {/* ── Transfers ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transfers</Text>
      </View>

      <ActionCard
        title='Send Spark Transfer'
        description='Transfer sats to another Spark address.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'to',
            type: 'text',
            label: 'Recipient Spark Address',
            placeholder: 'sp1...'
          },
          {
            id: 'amountSats',
            type: 'number',
            label: 'Amount (sats)',
            placeholder: '1000'
          }
        ]}
        action={async ({ index, to, amountSats }) => {
          const result = await callAccountMethod(
            'spark',
            parseInt(index),
            'transfer',
            { receiverSparkAddress: to, amountSats: parseInt(amountSats) }
          )
          return result
        }}
        actionLabel='Send'
      />

      <ActionCard
        title='Get Transfers'
        description='Fetch transfer history for this Spark account.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          }
        ]}
        action={async ({ index }) => {
          const transfers = await callAccountMethod(
            'spark',
            parseInt(index),
            'getTransfers'
          )
          return {
            count: Array.isArray(transfers) ? transfers.length : 0,
            transfers
          }
        }}
        actionLabel='Get Transfers'
      />

      {/* ── Lightning ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lightning</Text>
      </View>

      <ActionCard
        title='Create Lightning Invoice'
        description='Generate a Lightning invoice to receive payment into Spark.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'amountSats',
            type: 'number',
            label: 'Amount (sats)',
            placeholder: '1000'
          },
          {
            id: 'memo',
            type: 'text',
            label: 'Memo (optional)',
            placeholder: 'Payment for...'
          }
        ]}
        action={async ({ index, amountSats, memo }) => {
          const result = await callAccountMethod(
            'spark',
            parseInt(index),
            'createLightningInvoice',
            { amountSats: parseInt(amountSats), memo: memo || undefined }
          )
          return result
        }}
        actionLabel='Create Invoice'
      />

      <ActionCard
        title='Pay Lightning Invoice'
        description='Pay a Lightning invoice from your Spark balance.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'invoice',
            type: 'text',
            label: 'Lightning Invoice (BOLT11)',
            placeholder: 'lnbc...'
          }
        ]}
        action={async ({ index, invoice }) => {
          const result = await callAccountMethod(
            'spark',
            parseInt(index),
            'payLightningInvoice',
            { invoice }
          )
          return result
        }}
        actionLabel='Pay Invoice'
      />

      <ActionCard
        title='Quote Lightning Payment'
        description='Get a fee estimate for paying a Lightning invoice.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'invoice',
            type: 'text',
            label: 'Lightning Invoice (BOLT11)',
            placeholder: 'lnbc...'
          }
        ]}
        action={async ({ index, invoice }) => {
          const feeSats = await callAccountMethod(
            'spark',
            parseInt(index),
            'quotePayLightningInvoice',
            { paymentRequest: invoice }
          )
          return { estimatedFeeSats: String(feeSats) }
        }}
        actionLabel='Get Quote'
      />

      {/* ── Withdrawals ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Withdrawals (Cooperative Exit)</Text>
      </View>

      <ActionCard
        title='Quote Withdrawal'
        description='Get a fee estimate for withdrawing from Spark to an on-chain Bitcoin address.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'amountSats',
            type: 'number',
            label: 'Amount (sats)',
            placeholder: '10000'
          },
          {
            id: 'onchainAddress',
            type: 'text',
            label: 'Bitcoin Address',
            placeholder: 'bc1...'
          }
        ]}
        action={async ({ index, amountSats, onchainAddress }) => {
          const quote = await callAccountMethod(
            'spark',
            parseInt(index),
            'quoteWithdraw',
            { amountSats: parseInt(amountSats), onchainAddress }
          )
          return quote
        }}
        actionLabel='Get Quote'
      />

      <ActionCard
        title='Withdraw to L1'
        description='Cooperative exit: withdraw from Spark to an on-chain Bitcoin address.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'amountSats',
            type: 'number',
            label: 'Amount (sats)',
            placeholder: '10000'
          },
          {
            id: 'onchainAddress',
            type: 'text',
            label: 'Bitcoin Address',
            placeholder: 'bc1...'
          }
        ]}
        action={async ({ index, amountSats, onchainAddress }) => {
          const result = await callAccountMethod(
            'spark',
            parseInt(index),
            'withdraw',
            { amountSats: parseInt(amountSats), onchainAddress }
          )
          return result
        }}
        actionLabel='Withdraw'
      />

      {/* ── Signing ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Signing & Verification</Text>
      </View>

      <ActionCard
        title='Sign Message'
        description='Sign a message with the Spark wallet key.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'message',
            type: 'text',
            label: 'Message',
            placeholder: 'Hello Spark!'
          }
        ]}
        action={async ({ index, message }) => {
          const signature = await callAccountMethod(
            'spark',
            parseInt(index),
            'sign',
            message
          )
          return { message, signature }
        }}
        actionLabel='Sign'
      />

      <ActionCard
        title='Verify Signature'
        description='Verify a message signature.'
        fields={[
          {
            id: 'index',
            type: 'number',
            label: 'Account Index',
            defaultValue: '0'
          },
          {
            id: 'message',
            type: 'text',
            label: 'Message',
            placeholder: 'Hello Spark!'
          },
          {
            id: 'signature',
            type: 'text',
            label: 'Signature',
            placeholder: '0x...'
          }
        ]}
        action={async ({ index, message, signature }) => {
          const valid = await callAccountMethod(
            'spark',
            parseInt(index),
            'verify',
            { message, signature }
          )
          return { valid }
        }}
        actionLabel='Verify'
      />
    </FeatureLayout>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    marginBottom: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text
  }
})
