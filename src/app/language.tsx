import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LANGUAGES } from '@/i18n/translations';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import { useSettingsPalette } from '@/theme/settingsTheme';

export default function LanguageScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = useSettingsPalette();
  const { language, setLanguage, strings } = useSettings();

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
            <FontAwesome name="chevron-left" size={16} color={c.accent} />
          </Pressable>
          <Text style={[styles.title, { color: c.text }]}>{strings.language}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
            {LANGUAGES.map((lang, i) => {
              const selected = language === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => setLanguage(lang.code)}
                  style={[
                    styles.row,
                    i !== LANGUAGES.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: c.border,
                    },
                    selected && { backgroundColor: c.selectedBg },
                  ]}
                >
                  <Text style={[styles.name, { color: c.text }]}>{lang.name}</Text>
                  {selected && <FontAwesome name="check" size={15} color={c.accent} />}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: Font.tightBold, fontSize: 22 },
  content: { padding: 20, paddingTop: 4 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  name: { fontFamily: Font.medium, fontSize: 16 },
});
