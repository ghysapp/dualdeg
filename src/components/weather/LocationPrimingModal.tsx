import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLocations } from '@/state/locations';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';

const PALETTES = {
  light: { sheet: '#ffffff', text: '#161b26', subtext: '#5b6472', grabber: '#d7dbe3' },
  dark: { sheet: '#161d2b', text: '#eef2f9', subtext: '#9aa6b8', grabber: '#33405a' },
} as const;

/**
 * Custom pre-permission ("priming") dialog explaining why the app wants
 * location, shown BEFORE the OS prompt. The primary action is labelled "Next"
 * (it always leads to the system dialog — Apple 5.1.1(iv)); a dismiss option
 * exists only on Android, per Google Play's prominent-disclosure policy.
 */
export function LocationPrimingModal() {
  const scheme = useColorScheme();
  const c = PALETTES[scheme === 'dark' ? 'dark' : 'light'];
  const insets = useSafeAreaInsets();
  const { strings } = useSettings();
  const { primingVisible, primingNext, primingDismiss } = useLocations();

  return (
    <Modal
      visible={primingVisible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={Platform.OS === 'android' ? primingDismiss : undefined}
    >
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: c.sheet, paddingBottom: Math.max(insets.bottom, 20) + 8 }]}>
          <View style={[styles.grabber, { backgroundColor: c.grabber }]} />

          <LinearGradient
            colors={['#5fb0f7', '#7c6cf0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <FontAwesome name="map-marker" size={30} color="#ffffff" />
          </LinearGradient>

          <Text style={[styles.title, { color: c.text }]}>{strings.locTitle}</Text>
          <Text style={[styles.body, { color: c.subtext }]}>{strings.locBody}</Text>

          <Pressable onPress={primingNext} style={styles.nextWrap}>
            <LinearGradient
              colors={['#3b82f6', '#6366f1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtn}
            >
              <Text style={styles.nextText}>{strings.locNext}</Text>
              <FontAwesome name="chevron-right" size={13} color="#ffffff" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </Pressable>

          {Platform.OS === 'android' && (
            <Pressable onPress={primingDismiss} style={styles.dismissBtn} hitSlop={8}>
              <Text style={[styles.dismissText, { color: c.subtext }]}>{strings.locNotNow}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8,12,24,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 16,
  },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 22,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#5b6bd6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontFamily: Font.tightBold,
    fontSize: 23,
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontFamily: Font.regular,
    fontSize: 14.5,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 26,
    paddingHorizontal: 4,
  },
  nextWrap: {
    alignSelf: 'stretch',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextText: {
    fontFamily: Font.semibold,
    fontSize: 16,
    color: '#ffffff',
  },
  dismissBtn: {
    paddingVertical: 14,
    marginTop: 4,
  },
  dismissText: {
    fontFamily: Font.semibold,
    fontSize: 14,
  },
});
