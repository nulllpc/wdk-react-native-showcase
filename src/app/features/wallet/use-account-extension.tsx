import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAccount } from '@tetherto/wdk-react-native-core';
import type { UseAccountParams } from '@tetherto/wdk-react-native-core';
import { ActionCard } from '@/components/ActionCard';
import { FeatureLayout } from '@/components/FeatureLayout';
import { ConsoleOutput } from '@/components/ConsoleOutput';
import { colors } from '@/constants/colors';
import { TOKEN_MAP } from '@/config/token';
import { NETWORK_NAME } from '@/config/chain';
import { type WalletAccountBtc } from '@tetherto/wdk-wallet-btc';

export default function AccountExtensionScreen() {
  const [lookupParams] = useState<UseAccountParams>({ network: NETWORK_NAME.BITCOIN, accountIndex: 0 });

  const account = useAccount<WalletAccountBtc>({
    network: lookupParams?.network,
    accountIndex: lookupParams?.accountIndex
  });

  const btcExtension = account?.extension();

  const compatibleTokens = lookupParams
    ? Object.values(TOKEN_MAP).filter(t => t.getNetwork() === lookupParams.network)
    : [];
  const tokenOptions = compatibleTokens.map(t => ({ label: t.getSymbol(), value: t.getId() }));

  return (
    <FeatureLayout
      title="Wallet Account Lookup"
      description="Look up a specific account by network and index to interact with it."
    >
      {lookupParams && (
        !account ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Unavailable</Text>
            <Text style={styles.sectionSubtitle}>
              Could not load account for "{lookupParams.network}" at index {lookupParams.accountIndex}. The wallet may be locked or not initialized.
            </Text>
            <ConsoleOutput data={{ ...lookupParams, error: "useAccount returned null" }} />
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Details</Text>
              <Text style={styles.sectionSubtitle}>
                Derived from network "{lookupParams.network}" at index {lookupParams.accountIndex}
              </Text>
              <ConsoleOutput data={{
                address: account.address,
                account: account.account
              }} />
            </View>

            <ActionCard
              title="Get Transfers (BTC Extension)"
              description="Fetches the transaction history for this BTC account."
              fields={[
                {
                  id: 'direction',
                  type: 'select',
                  label: 'Direction',
                  options: [
                    { label: 'All', value: 'all' },
                    { label: 'Incoming', value: 'incoming' },
                    { label: 'Outgoing', value: 'outgoing' },
                  ],
                  defaultValue: 'all',
                },
                { id: 'limit', type: 'number', label: 'Limit', defaultValue: '10' },
                { id: 'skip', type: 'number', label: 'Skip', defaultValue: '0' },
              ]}
              action={async ({ direction, limit, skip }) => {
                if (!btcExtension) {
                  throw new Error('BTC extension is not available');
                }
                const transfers = await btcExtension.getTransfers({
                  direction: direction as 'all' | 'incoming' | 'outgoing',
                  limit: parseInt(limit, 10),
                  skip: parseInt(skip, 10),
                });
                // The result has BigInts, which don't serialize in JSON.
                // We need to convert them to strings for display.
                const serializableTransfers = transfers.map(tx => ({
                  ...tx,
                  value: tx.value.toString(),
                  fee: tx.fee?.toString(),
                }));
                return serializableTransfers;
              }}
              actionLabel="Get Transfers"
            />

            <ActionCard
              title="Get Balance"
              description="Fetches balance for a selected asset."
              fields={[
                { id: 'tokenId', type: 'select', label: 'Select Asset', options: tokenOptions }
              ]}
              action={async ({ tokenId }) => {
                const asset = TOKEN_MAP.get(tokenId);
                if (!asset) throw new Error(`Asset with id ${tokenId} not found`);
                // getBalance expects an array of assets
                const balances = await account.getBalance([asset]);
                return balances;
              }}
              actionLabel="Get Balance"
            />

            <ActionCard
              title="Send Transaction"
              description="Executes a transfer of any asset."
              fields={[
                { id: 'to', type: 'text', label: 'Recipient Address', placeholder: '0x...' },
                { id: 'amount', type: 'text', label: 'Amount (in smallest unit)', placeholder: '1000000' },
                { id: 'assetId', type: 'select', label: 'Asset to Send', options: tokenOptions },
              ]}
              action={async ({ to, amount, assetId }) => {
                const asset = TOKEN_MAP.get(assetId);
                if (!asset) throw new Error(`Asset with id ${assetId} not found`);

                const result = await account.send({ to, amount, asset });
                return result;
              }}
              actionLabel="Send"
            />

            <ActionCard
              title="Sign Message"
              description="Signs a UTF-8 message with the account's private key."
              fields={[
                { id: 'message', type: 'text', label: 'Message to Sign', placeholder: 'Hello, world!' }
              ]}
              action={async ({ message }) => {
                const signature = await account.sign(message);
                return { signature };
              }}
              actionLabel="Sign"
            />
            
            <ActionCard
              title="Verify Signature"
              description="Verifies a signature against a message."
              fields={[
                { id: 'message', type: 'text', label: 'Original Message' },
                { id: 'signature', type: 'text', label: 'Signature' },
              ]}
              action={async ({ message, signature }) => {
                const isValid = await account.verify(message, signature);
                return { isValid };
              }}
              actionLabel="Verify"
            />
          </>
        )
      )}
    </FeatureLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
});