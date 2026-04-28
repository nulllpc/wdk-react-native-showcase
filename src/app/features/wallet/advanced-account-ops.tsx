import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAccount } from '@tetherto/wdk-react-native-core';
import type { UseAccountParams } from '@tetherto/wdk-react-native-core';
import { ActionCard } from '@/components/ActionCard';
import { FeatureLayout } from '@/components/FeatureLayout';
import { ConsoleOutput } from '@/components/ConsoleOutput';
import { colors } from '@/constants/colors';
import { TOKEN_MAP } from '@/config/token';

export default function GetAccountScreen() {
  const [lookupParams, setLookupParams] = useState<UseAccountParams | null>(null);

  const account = useAccount({
    network: lookupParams?.network ?? '',
    accountIndex: lookupParams?.accountIndex ?? 0
  });

  const compatibleTokens = lookupParams
    ? Object.values(TOKEN_MAP).filter(t => t.getNetwork() === lookupParams.network)
    : [];
  const tokenOptions = compatibleTokens.map(t => ({ label: t.getSymbol(), value: t.getId() }));

  return (
    <FeatureLayout
      title="Wallet Account Lookup"
      description="Look up a specific account by network and index to interact with it."
    >
      <ActionCard
        title="Find Account"
        description="Provide a network and account index to derive a specific account."
        fields={[
          { id: 'network', type: 'chain', label: 'Select Network' },
          { id: 'index', type: 'number', label: 'Account Index', defaultValue: '0' }
        ]}
        action={async ({ network, index }) => {
          setLookupParams({ network, accountIndex: parseInt(index, 10) });
          return { success: `Displaying controls for network: ${network}, index: ${index}` };
        }}
        actionLabel="Look up Account"
      />

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
