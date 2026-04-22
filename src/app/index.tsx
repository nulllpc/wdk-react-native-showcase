import { ActivityIndicator, View, StyleSheet, ScrollView, Image, TouchableOpacity, Text } from 'react-native'
import { useWdkApp } from '@tetherto/wdk-react-native-core'
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wallet, Layers, Component, ChevronRight, CheckCircle2, XCircle, Settings } from 'lucide-react-native';

const FeatureGroup = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <View style={styles.groupContainer}>
    <View style={styles.groupHeader}>
      {icon}
      <Text style={styles.groupTitle}>{title}</Text>
    </View>
    <View style={styles.groupContent}>
      {children}
    </View>
  </View>
);

const FeatureItem = ({ title, route }: { title: string, route: string }) => {
  const router = useRouter();
  return (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => router.push(route as any)}
    >
      <Text style={styles.itemText}>{title}</Text>
      <ChevronRight size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const StatusBadge = ({ label, active }: { label: string, active: boolean }) => (
  <View style={[styles.badge, active ? styles.badgeActive : styles.badgeInactive]}>
    {active ? <CheckCircle2 size={12} color={colors.black} /> : <XCircle size={12} color={colors.textSecondary} />}
    <Text style={[styles.badgeText, active && styles.badgeTextActive]}>{label}</Text>
  </View>
);

export default function App() {
  const { state } = useWdkApp();
  const insets = useSafeAreaInsets();

  if (state.status === 'INITIALIZING') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../assets/images/wdk-logo.png')}
              style={styles.wdkLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>WDK Showcase App</Text>
          <Text style={styles.subtitle}>
            Explore the unified capabilities of the Wallet Development Kit.
          </Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>WDK Lifecycle Status:</Text>
            <View style={styles.badges}>
              <StatusBadge label="Worklet Ready" active={['NO_WALLET', 'LOCKED', 'READY', 'REINITIALIZING'].includes(state.status)} />
              <StatusBadge label="Wallet Ready" active={state.status === 'READY'} />
            </View>
          </View>
        </View>

        <View style={styles.groupsContainer}>
          <FeatureGroup 
            title="Wallet Modules" 
            icon={<Wallet size={20} color={colors.primary} />}
          >
            <FeatureItem title="Manage Wallets" route="/features/wallet/manage-account" />
            <FeatureItem title="Common Account Interaction" route="/features/wallet/get-account" />
            <FeatureItem title="Get Balance" route="/features/wallet/get-balance" />
            <FeatureItem title="Balance Hooks Demo" route="/features/wallet/balance-demo" />
          </FeatureGroup>

          <FeatureGroup 
            title="Protocol Modules" 
            icon={<Layers size={20} color={colors.primary} />}
          >
            <FeatureItem title="Swap" route="/features/protocols/swap" />
            <FeatureItem title="Lending" route="/features/protocols/lending" />
          </FeatureGroup>

          <FeatureGroup 
            title="Middleware" 
            icon={<Component size={20} color={colors.primary} />}
          >
            <FeatureItem title="Pricing Service" route="/features/middleware/pricing" />
            <FeatureItem title="Indexer" route="/features/middleware/indexer" />
          </FeatureGroup>

          <FeatureGroup 
            title="System & Config" 
            icon={<Settings size={20} color={colors.primary} />}
          >
            <FeatureItem title="View Configuration" route="/features/config/view-config" />
          </FeatureGroup>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center'
  },
  wdkLogo: {
    width: 180, 
    height: 180,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 12,
    width: '100%',
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
  },
  badgeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  badgeInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  badgeTextActive: {
    color: colors.black,
  },
  groupsContainer: {
    paddingHorizontal: 20,
    gap: 24,
  },
  groupContainer: {
    gap: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 4,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  groupContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  itemText: {
    fontSize: 16,
    color: colors.text,
  }
});
