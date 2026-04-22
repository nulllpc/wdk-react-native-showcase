import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useBalance, useRefreshBalance } from '@tetherto/wdk-react-native-core';
import { FeatureLayout } from '@/components/FeatureLayout';
import { ConsoleOutput } from '@/components/ConsoleOutput';
import { colors } from '@/constants/colors';
import { TOKEN_MAP } from '@/config/token';
import type { AppAsset } from '@/entities/AppAsset';
import { RefreshCw } from 'lucide-react-native';

const BalanceRow = ({ asset, accountIndex }: { asset: AppAsset, accountIndex: number }) => {
  const { data: balanceData, isLoading, error, refetch } = useBalance(
    accountIndex,
    asset,
    {
      staleTime: 30 * 1000,
    }
  );

  const displayBalance = useMemo(() => {
    if (isLoading) return 'Loading...';
    if (error) return 'Error';
    if (!balanceData?.success) return 'Failed';
    return balanceData.balance;
  }, [balanceData, isLoading, error]);

  return (
    <View style={styles.row}>
      <View style={styles.assetInfo}>
        <Text style={styles.assetSymbol}>{asset.getSymbol()}</Text>
        <Text style={styles.assetName}>{asset.getName()}</Text>
      </View>
      <View style={styles.balanceInfo}>
        <Text style={styles.balanceText}>{displayBalance}</Text>
        {error && <ConsoleOutput data={error.message} error />}
      </View>
      <TouchableOpacity onPress={() => refetch()} disabled={isLoading} style={styles.refreshButton}>
        {isLoading ? <ActivityIndicator size="small" color={colors.primary} /> : <RefreshCw size={18} color={colors.textSecondary} />}
      </TouchableOpacity>
    </View>
  );
};


export default function GetBalanceScreen() {
  const accountIndex = 0;
  const { mutate: refreshAllBalances, isPending: isRefreshingAll } = useRefreshBalance();

  const handleRefreshAll = () => {
    refreshAllBalances({ accountIndex, type: 'wallet' });
  };

  return (
    <FeatureLayout 
      title="Wallet Balances" 
      description="Fetch and monitor asset balances. Each asset is managed by its own query."
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>All Asset Balances</Text>
          <TouchableOpacity onPress={handleRefreshAll} disabled={isRefreshingAll} style={styles.refreshButton}>
            {isRefreshingAll ? (
               <ActivityIndicator size="small" color={colors.primary} />
            ) : (
               <RefreshCw size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDesc}>
          Using `useBalance` for each asset. Press the master refresh button to refetch all.
        </Text>
      </View>

      <ScrollView>
        {Object.values(TOKEN_MAP).map(asset => (
          <BalanceRow key={asset.getId()} asset={asset} accountIndex={accountIndex} />
        ))}
      </ScrollView>
    </FeatureLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  refreshButton: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assetInfo: {
    flex: 1,
  },
  assetSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  assetName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  balanceInfo: {
    flex: 2,
    alignItems: 'flex-end',
    marginRight: 12,
  },
  balanceText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
});
