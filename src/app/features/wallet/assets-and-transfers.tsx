import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useBalancesForWallet } from '@tetherto/wdk-react-native-core';
import { FeatureLayout } from '@/components/FeatureLayout';
import { colors } from '@/constants/colors';
import { TOKEN_MAP } from '@/config/token';
import { RefreshCw, ArrowUpRight } from 'lucide-react-native';

export default function AssetsAndTransfersScreen() {
  const accountIndex = 0;
  
  const { 
    data: balances, 
    isLoading, 
    isRefetching, 
    refetch, 
    error 
  } = useBalancesForWallet(
    accountIndex,
    Array.from(TOKEN_MAP.values()),
    { enabled: true }
  );

  return (
    <FeatureLayout 
      title="Assets & Transfers" 
      description="View your portfolio balances and manage fund transfers."
    >
      <View style={styles.headerCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.sectionLabel}>Total Assets</Text>
          <TouchableOpacity 
            onPress={() => refetch()} 
            disabled={isLoading || isRefetching}
            style={styles.iconButton}
          >
            {(isLoading || isRefetching) ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <RefreshCw size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.mainTitle}>Portfolio Overview</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Balances</Text>
        
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Error fetching balances: {error.message}</Text>
          </View>
        )}

        <View style={styles.listContainer}>
          {Array.from(TOKEN_MAP.values()).map((asset) => {
            const balanceObj = balances?.find(b => b.assetId === asset.getId());
            const balanceValue = balanceObj?.balance || '0.00';

            return (
              <View key={asset.getId()} style={styles.assetRow}>
                <View style={styles.assetIconContainer}>
                  {asset.getLogo() ? (
                    <Image source={asset.getLogo()} style={styles.assetLogo} />
                  ) : (
                    <View style={styles.placeholderLogo}>
                      <Text style={styles.placeholderLogoText}>{asset.getSymbol()[0]}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.assetMeta}>
                  <Text style={styles.assetSymbol}>{asset.getSymbol()}</Text>
                  <Text style={styles.assetNetwork}>{asset.getNetwork().toUpperCase()}</Text>
                </View>

                <View style={styles.balanceMeta}>
                  <Text style={styles.balanceText}>{balanceValue} {asset.getSymbol()}</Text>
                  <TouchableOpacity style={styles.sendButtonSmall}>
                    <ArrowUpRight size={14} color={colors.primary} />
                    <Text style={styles.sendButtonTextSmall}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </FeatureLayout>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  iconButton: {
    padding: 4,
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  listContainer: {
    gap: 12,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assetIconContainer: {
    marginRight: 12,
  },
  assetLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  placeholderLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLogoText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  assetMeta: {
    flex: 1,
  },
  assetSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  assetNetwork: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  balanceMeta: {
    alignItems: 'flex-end',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sendButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sendButtonTextSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  errorBox: {
    backgroundColor: 'rgba(255,0,0,0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#fc8181',
    fontSize: 12,
  }
});
