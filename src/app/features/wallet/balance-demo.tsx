import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useBalance, useBalancesForWallet, useRefreshBalance } from '@tetherto/wdk-react-native-core';
import { FeatureLayout } from '@/components/FeatureLayout';
import { colors } from '@/constants/colors';
import { TOKEN_MAP } from '@/config/token';
import { ConsoleOutput } from '@/components/ConsoleOutput';
import { AppAsset } from '@/entities/AppAsset';

export default function BalanceDemoScreen() {
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const selectedAsset: AppAsset = Object.values(TOKEN_MAP)[selectedAssetIndex];
  const accountIndex = 0; // Default account index

  const { 
    data: singleBalance, 
    isLoading: isLoadingSingle, 
    isRefetching: isRefetchingSingle,
    refetch: refetchSingle,
    error: singleError 
  } = useBalance(
    accountIndex,
    selectedAsset,
    { enabled: true }
  );

  const {
    data: allBalances,
    isLoading: isLoadingAll,
    isRefetching: isRefetchingAll,
    refetch: refetchAll,
    error: allError
  } = useBalancesForWallet(
    accountIndex,
    Object.values(TOKEN_MAP),
    { enabled: true }
  );

  const { mutate: refreshBalance, isPending: isRefreshing } = useRefreshBalance();

  const handleRefreshSingle = () => {
    refreshBalance({
      network: selectedAsset.getNetwork(),
      accountIndex,
      assetId: selectedAsset.getId(),
      type: 'token'
    });
  };

  const handleRefreshWallet = () => {
    refreshBalance({
      accountIndex,
      type: 'wallet'
    });
  };

  return (
    <FeatureLayout
      title="Balance Hooks Demo"
      description="Demonstrates useBalance, useBalancesForWallet, and useRefreshBalance."
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Section 1: Single Balance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Single Balance (useBalance)</Text>
          <Text style={styles.description}>
            Select an asset to fetch its specific balance.
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.assetSelector}>
            {Object.values(TOKEN_MAP).map((token, index) => (
              <TouchableOpacity
                key={token.getId()}
                style={[
                  styles.assetChip,
                  selectedAssetIndex === index && styles.assetChipSelected
                ]}
                onPress={() => setSelectedAssetIndex(index)}
              >
                <Text style={[
                  styles.assetChipText,
                  selectedAssetIndex === index && styles.assetChipTextSelected
                ]}>
                  {token.getSymbol()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.resultBox}>
            <Text style={styles.label}>Network: <Text style={styles.value}>{selectedAsset.getNetwork()}</Text></Text>
            <Text style={styles.label}>Asset: <Text style={styles.value}>{selectedAsset.getName()} ({selectedAsset.getSymbol()})</Text></Text>
            
            {isLoadingSingle ? (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : singleError ? (
              <Text style={styles.errorText}>Error: {singleError.message}</Text>
            ) : (
              <Text style={styles.balanceValue}>
                {singleBalance?.balance || '0'} {selectedAsset.getSymbol()}
              </Text>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => refetchSingle()}
                disabled={isLoadingSingle || isRefetchingSingle}
              >
                <Text style={styles.buttonText}>
                  {isRefetchingSingle ? 'Refetching...' : 'Refetch (Query)'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]} 
                onPress={handleRefreshSingle}
                disabled={isRefreshing}
              >
                <Text style={styles.buttonTextSecondary}>
                  {isRefreshing ? 'Refreshing...' : 'Refresh (Mutation)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {singleBalance && (
            <ConsoleOutput data={JSON.stringify(singleBalance, null, 2)} />
          )}
        </View>

        {/* Section 2: All Balances */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Wallet Balances (useBalancesForWallet)</Text>
          <Text style={styles.description}>
            Fetches balances for all configured tokens for this wallet.
          </Text>

          <View style={styles.buttonRow}>
             <TouchableOpacity 
                style={styles.button} 
                onPress={() => refetchAll()}
                disabled={isLoadingAll || isRefetchingAll}
              >
                <Text style={styles.buttonText}>
                  {isRefetchingAll ? 'Refetch All (Query)' : 'Refetch All'}
                </Text>
              </TouchableOpacity>
               <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]} 
                onPress={handleRefreshWallet}
                disabled={isRefreshing}
              >
                <Text style={styles.buttonTextSecondary}>
                  {isRefreshing ? 'Refreshing...' : 'Refresh Wallet (Mutation)'}
                </Text>
              </TouchableOpacity>
          </View>

          {isLoadingAll ? (
             <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : allError ? (
            <Text style={styles.errorText}>Error: {allError.message}</Text>
          ) : (
            <View style={styles.listContainer}>
              {allBalances?.map((bal, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.listItemSymbol}>{Object.values(TOKEN_MAP).find(t => t.getId() === bal.assetId)?.getSymbol() || bal.assetId}</Text>
                  <Text style={styles.listItemValue}>{bal.balance}</Text>
                </View>
              ))}
              {(!allBalances || allBalances.length === 0) && (
                <Text style={styles.emptyText}>No balances found.</Text>
              )}
            </View>
          )}
        </View>

      </ScrollView>
    </FeatureLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  assetSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  assetChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  assetChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  assetChipText: {
    color: colors.text,
    fontWeight: '500',
  },
  assetChipTextSelected: {
    color: '#fff',
  },
  resultBox: {
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    color: colors.text,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 16,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red', // Or a semantic error color if available
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  buttonTextSecondary: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  listContainer: {
    marginTop: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemSymbol: {
    fontWeight: 'bold',
    color: colors.text,
  },
  listItemValue: {
    color: colors.text,
  },
  emptyText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});
