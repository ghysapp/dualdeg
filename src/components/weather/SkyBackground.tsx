import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import type { SkyTheme } from '@/theme/sky';

/** Fixed pseudo-random star field for the night palette. */
const STARS = [
  { top: '6%', left: '12%', size: 2 },
  { top: '10%', left: '68%', size: 1.5 },
  { top: '14%', left: '34%', size: 2.4 },
  { top: '8%', left: '88%', size: 1.6 },
  { top: '20%', left: '22%', size: 1.4 },
  { top: '24%', left: '78%', size: 2 },
  { top: '18%', left: '52%', size: 1.3 },
  { top: '30%', left: '90%', size: 1.8 },
  { top: '34%', left: '8%', size: 1.5 },
  { top: '28%', left: '44%', size: 1.2 },
  { top: '40%', left: '64%', size: 1.6 },
  { top: '44%', left: '30%', size: 1.3 },
] as const;

export function SkyBackground({
  sky,
  children,
  style,
}: {
  sky: SkyTheme;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <LinearGradient
      colors={sky.gradient as unknown as readonly [string, string, ...string[]]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={[styles.fill, style]}
    >
      {sky.stars && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {STARS.map((s, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                top: s.top as ViewStyle['top'],
                left: s.left as ViewStyle['left'],
                width: s.size,
                height: s.size,
                borderRadius: s.size,
                backgroundColor: '#ffffff',
                opacity: 0.7,
              }}
            />
          ))}
        </View>
      )}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
