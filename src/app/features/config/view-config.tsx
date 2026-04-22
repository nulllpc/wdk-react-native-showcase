import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FeatureLayout } from '@/components/FeatureLayout';
import { ConsoleOutput } from '@/components/ConsoleOutput';
import { colors } from '@/constants/colors';
import wdkConfigs from '@/config/chain';
import { TOKEN_MAP } from '@/config/token';
import { ChevronDown, ChevronUp, Network, Coins, Database } from 'lucide-react-native';

const ConfigGroup = ({ title, subtitle, chainData, tokenData }: { title: string, subtitle: string, chainData: any, tokenData: any }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.itemHeader} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Database size={20} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.itemSubtitle}>{subtitle}</Text>
          </View>
        </View>
        {expanded ? (
          <ChevronUp color={colors.textSecondary} size={20} />
        ) : (
          <ChevronDown color={colors.textSecondary} size={20} />
        )}
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.itemContent}>
          
          {/* Chain Details */}
          <View style={styles.subSection}>
            <View style={styles.subHeader}>
              <Network size={14} color={colors.textSecondary} />
              <Text style={styles.subHeaderTitle}>Chain Configuration</Text>
            </View>
            <ConsoleOutput data={chainData} />
          </View>

          {/* Token Details */}
          {tokenData && (
            <View style={styles.subSection}>
              <View style={styles.subHeader}>
                <Coins size={14} color={colors.textSecondary} />
                <Text style={styles.subHeaderTitle}>Token Configuration</Text>
              </View>
              
              {/* Native Token */}
              {tokenData.native && (
                <View style={styles.tokenRow}>
                  <Text style={styles.tokenLabel}>Native:</Text>
                  <Text style={styles.tokenValue}>{tokenData.native.symbol} ({tokenData.native.name})</Text>
                </View>
              )}

              {/* Token List */}
              {tokenData.tokens && tokenData.tokens.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  <Text style={[styles.tokenLabel, { marginBottom: 4 }]}>Tokens:</Text>
                  {tokenData.tokens.map((t: any, idx: number) => (
                    <View key={idx} style={styles.tokenItem}>
                       <Text style={styles.tokenSymbol}>{t.symbol}</Text>
                       <Text style={styles.tokenAddress} numberOfLines={1} ellipsizeMode="middle">{t.address}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

        </View>
      )}
    </View>
  );
};

export default function ViewConfigScreen() {
  return (
    <FeatureLayout 
      title="Network Configuration" 
      description="Combined view of Chain and Token definitions per network."
    >
      
      {/* Developer Instruction Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How to Modify</Text>
        <Text style={styles.infoText}>
          Add networks or tokens by editing the configuration files:
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeLine}>• src/config/chain.ts</Text>
          <Text style={styles.codeLine}>• src/config/token.ts</Text>
        </View>
        <Text style={styles.infoFooter}>
          Changes will reflect here automatically after a reload.
        </Text>
      </View>

      <View style={styles.list}>
        {Object.entries(wdkConfigs).map(([key, chainConfig]: [string, any]) => {
          const networkName = key;
          const networkTokens = Array.from(TOKEN_MAP.values()).filter(
            (token) => token.getNetwork() === networkName
          );

          const nativeToken = networkTokens.find((token) => token.isNative());
          const otherTokens = networkTokens.filter((token) => !token.isNative());

          const tokenData = {
            native: nativeToken,
            tokens: otherTokens,
          };
          
          return (
            <ConfigGroup
              key={key}
              title={key.toUpperCase()}
              subtitle={`Chain ID: ${chainConfig.chainId || 'N/A'}`}
              chainData={chainConfig}
              tokenData={tokenData}
            />
          );
        })}
      </View>

    </FeatureLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
  itemContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  subSection: {
    marginBottom: 20,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  subHeaderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tokenLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    width: 60,
  },
  tokenValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  tokenSymbol: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    width: 60,
  },
  tokenAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    flex: 1,
  },
  infoCard: {
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#63b3ed',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  codeBlock: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  codeLine: {
    fontFamily: 'monospace',
    color: '#90cdf4',
    fontSize: 13,
    marginBottom: 4,
  },
  infoFooter: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
