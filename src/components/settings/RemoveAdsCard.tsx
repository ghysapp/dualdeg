import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { usePurchases } from '@/state/purchases';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';

const PALETTES = {
  light: { surface: '#ffffff', border: '#e3e7ee', text: '#1c2433', subtext: '#6b7280', accent: '#2f7ad6' },
  dark: { surface: '#172033', border: '#26324a', text: '#eef2f9', subtext: '#94a1b8', accent: '#5fa3ec' },
} as const;

/**
 * "Remove ads" upsell / owned state for the Settings screen. Hidden when IAP
 * isn't available on this build (e.g. Expo Go) and nothing has been purchased.
 */
export function RemoveAdsCard() {
  const scheme = useColorScheme();
  const c = PALETTES[scheme === 'dark' ? 'dark' : 'light'];
  const { strings } = useSettings();
  const { removeAds, price, available, purchasing, buy, restore } = usePurchases();

  const onRestore = async () => {
    const owned = await restore();
    // Success flips the card to its owned state; only surface a message when
    // nothing was found (the owned state is its own confirmation).
    Alert.alert(strings.iapRemoveAds, owned ? strings.iapOwned : strings.iapRestoreNone);
  };

  if (removeAds) {
    return (
      <LinearGradient
        colors={['#22c55e', '#16a34a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ownedCard}
      >
        <View style={styles.ownedIcon}>
          <FontAwesome name="check" size={16} color="#ffffff" />
        </View>
        <Text style={styles.ownedText}>{strings.iapOwned}</Text>
      </LinearGradient>
    );
  }

  if (!available) return null;

  const buyLabel = price ? `${strings.iapRemoveAds} · ${price}` : strings.iapRemoveAds;

  return (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
      <View style={styles.row}>
        <LinearGradient
          colors={['#5fb0f7', '#7c6cf0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircle}
        >
          <FontAwesome name="star" size={20} color="#ffffff" />
        </LinearGradient>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: c.text }]}>{strings.iapRemoveAds}</Text>
          <Text style={[styles.tagline, { color: c.subtext }]}>{strings.iapTagline}</Text>
        </View>
      </View>

      <Pressable onPress={buy} disabled={purchasing} style={styles.buyWrap}>
        <LinearGradient
          colors={['#3b82f6', '#6366f1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.buyBtn, purchasing && { opacity: 0.7 }]}
        >
          {purchasing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buyText}>{buyLabel}</Text>
          )}
        </LinearGradient>
      </Pressable>

      <Pressable onPress={onRestore} disabled={purchasing} hitSlop={6} style={styles.restoreBtn}>
        <Text style={[styles.restoreText, { color: c.accent }]}>{strings.iapRestore}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#5b6bd6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontFamily: Font.tightBold,
    fontSize: 18,
  },
  tagline: {
    fontFamily: Font.regular,
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 2,
  },
  buyWrap: {
    marginTop: 16,
  },
  buyBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    minHeight: 50,
  },
  buyText: {
    fontFamily: Font.semibold,
    fontSize: 15.5,
    color: '#ffffff',
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 2,
  },
  restoreText: {
    fontFamily: Font.semibold,
    fontSize: 13.5,
  },
  ownedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    marginBottom: 28,
  },
  ownedIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ownedText: {
    flex: 1,
    fontFamily: Font.semibold,
    fontSize: 15,
    color: '#ffffff',
  },
});
