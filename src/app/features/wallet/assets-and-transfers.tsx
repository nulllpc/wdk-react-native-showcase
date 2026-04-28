import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Image, TextInput, Alert, ScrollView } from 'react-native';
import { useBalancesForWallet, useAccount } from '@tetherto/wdk-react-native-core';
import { FeatureLayout } from '@/components/FeatureLayout';
import { colors } from '@/constants/colors';
import { TOKEN_MAP } from '@/config/token';
import { RefreshCw, ArrowUpRight, Send, CheckCircle2 } from 'lucide-react-native';
import { ConsoleOutput } from '@/components/ConsoleOutput';
import { AssetSelector } from '@/components/AssetSelector';

export default function AssetsAndTransfersScreen() {
  const accountIndex = 0;

  const [selectedAssetId, setSelectedAssetId] = useState(Array.from(TOKEN_MAP.keys())[0]);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [txResult, setTxResult] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  const selectedAssetForTransfer = TOKEN_MAP.get(selectedAssetId);

  const account = useAccount({
    network: selectedAssetForTransfer?.getNetwork() ?? '',
    accountIndex
  });

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

  const handleSend = async () => {
    if (!account) {
      Alert.alert('Error', 'Account not loaded. Ensure wallet is unlocked.');
      return;
    }
    if (!recipient || !amount) {
      Alert.alert('Error', 'Please provide recipient and amount.');
      return;
    }

    setIsSending(true);
    setTxResult(null);
    try {
      const result = await account.send({
        to: recipient,
        amount: amount,
        asset: selectedAssetForTransfer!
      });
      setTxResult(result);
      setAmount('');
      setRecipient('');
      refetch();
    } catch (e: any) {
      Alert.alert('Transfer Failed', e.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <FeatureLayout 
      title="Assets & Transfers" 
      description="View your portfolio balances and manage fund transfers."
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.transferCard}>
          <Text style={styles.cardLabel}>Quick Transfer</Text>
          
          <AssetSelector 
            selectedAssetId={selectedAssetId} 
            onSelectAssetId={setSelectedAssetId} 
          />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipient Address</Text>
            <TextInput
              style={styles.input}
              placeholder="0x... or Address"
              placeholderTextColor={colors.textSecondary}
              value={recipient}
              onChangeText={setRecipient}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount (Smallest Units)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1000000"
              placeholderTextColor={colors.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity 
            style={[styles.sendButton, (!account || isSending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!account || isSending}
          >
            {isSending ? (
              <ActivityIndicator color={colors.black} />
            ) : (
              <>
                <Send size={18} color={colors.black} />
                <Text style={styles.sendButtonText}>Send Funds</Text>
              </>
            )}
          </TouchableOpacity>

          {txResult && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <CheckCircle2 size={16} color="#48BB78" />
                <Text style={styles.resultTitle}>Transfer Successful</Text>
              </View>
              <ConsoleOutput data={txResult} />
            </View>
          )}
        </View>

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
                    <TouchableOpacity 
                      style={styles.sendButtonSmall}
                      onPress={() => setSelectedAssetId(asset.getId())}
                    >
                      <ArrowUpRight size={14} color={colors.primary} />
                      <Text style={styles.sendButtonTextSmall}>Select</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </FeatureLayout>
  );
}

const styles = StyleSheet.create({
  transferCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    color: colors.text,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#48BB78',
  },
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
