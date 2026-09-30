/**
 * Temperature reference: a horizontally scrollable ruler from -30°C to +50°C.
 * Each tick shows the primary unit on top and its equivalent in the other unit
 * below, ordered by the user's C/F preference, and opens centred on 15°.
 *
 * The ruler's spine is a thermal spectrum — cold blue → freezing teal → warm
 * red — so the axis doubles as a legend, and the labelled 10° marks are tinted
 * to the temperature they sit at. 0° carries a freezing dot.
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import type { SkyTheme } from '@/theme/sky';
import { cToF } from '@/utils/units';

const MIN_C = -30;
const MAX_C = 50;
const CENTER_C = 15;
const TICK_W = 38;
const HPAD = 12;

/**
 * Thermal ramp for the labelled marks, indexed by `(°C + 30) / 10` — one colour
 * per 10° step from -30 to +50. Reused as the axis gradient (evenly spaced),
 * which keeps every mark's tint aligned with the spectrum beneath it.
 */
const THERMAL = [
  '#2f6fc9', // -30
  '#3d90d6', // -20
  '#52b9d8', // -10
  '#5fcbc8', //   0  (freezing)
  '#93c98f', //  10
  '#d6c57e', //  20
  '#eca64c', //  30
  '#e8804a', //  40
  '#e2554a', //  50
] as const;
const AXIS_LOCATIONS = THERMAL.map((_, i) => i / (THERMAL.length - 1));
const FREEZE = THERMAL[3];

interface Tick {
  c: number;
  primary: number;
  secondary: number;
  major: boolean;
}

const TICK_COUNT = MAX_C - MIN_C + 1;
/** Full ruler length: side padding + every tick. */
const CONTENT_W = HPAD * 2 + TICK_COUNT * TICK_W;
/** First tick to render so the opening window already surrounds `CENTER_C`. */
const INITIAL_INDEX = Math.max(0, CENTER_C - MIN_C - 4);

/** Left scroll offset that lands `CENTER_C` in the middle of a `width`-wide viewport. */
function offsetForCenter(width: number): number {
  const idx = CENTER_C - MIN_C;
  return Math.max(0, HPAD + idx * TICK_W + TICK_W / 2 - width / 2);
}

export function TempScale({ sky }: { sky: SkyTheme }) {
  const { tempOrder, strings } = useSettings();
  const listRef = useRef<FlatList<Tick>>(null);

  const primaryUnit = tempOrder === 'FC' ? 'F' : 'C';
  const secondaryUnit = primaryUnit === 'C' ? 'F' : 'C';

  const ticks = useMemo<Tick[]>(() => {
    const out: Tick[] = [];
    for (let c = MIN_C; c <= MAX_C; c++) {
      const f = Math.round(cToF(c));
      out.push({
        c,
        primary: tempOrder === 'FC' ? f : c,
        secondary: tempOrder === 'FC' ? c : f,
        major: c % 10 === 0,
      });
    }
    return out;
  }, [tempOrder]);

  // Correct the initial position against the real viewport width once laid out.
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    listRef.current?.scrollToOffset({ offset: offsetForCenter(e.nativeEvent.layout.width), animated: false });
  }, []);

  return (
    <View style={styles.section}>
      <Text style={[styles.heading, { color: sky.textSecondary }]}>
        {strings.tempReference.toUpperCase()}
      </Text>
      <View style={[styles.panel, { backgroundColor: sky.cardBg, borderColor: sky.cardBorder }]}>
        {/* Virtualized: 81 ticks, ~9 on screen. Mounting them all cost ~0.4 s
            of JS on first render on a 4 GB phone; now only the visible window
            (plus a buffer) is built, starting around 15°. */}
        <FlatList
          ref={listRef}
          horizontal
          data={ticks}
          keyExtractor={(t) => String(t.c)}
          showsHorizontalScrollIndicator={false}
          onLayout={onLayout}
          getItemLayout={(_, index) => ({ length: TICK_W, offset: HPAD + TICK_W * index, index })}
          initialScrollIndex={INITIAL_INDEX}
          initialNumToRender={14}
          maxToRenderPerBatch={10}
          windowSize={5}
          contentContainerStyle={styles.row}
          ListHeaderComponentStyle={styles.headerCell}
          ListHeaderComponent={
            // Thermal spectrum spine, spanning the whole ruler behind the ticks.
            <LinearGradient
              colors={THERMAL as unknown as readonly [string, string, ...string[]]}
              locations={AXIS_LOCATIONS as unknown as readonly [number, number, ...number[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.axis}
            />
          }
          ListFooterComponent={<View style={{ width: HPAD }} />}
          renderItem={({ item: t }) => {
            const tint = t.major ? THERMAL[(t.c - MIN_C) / 10] : undefined;
            return (
              <View style={styles.tick}>
                <Text
                  style={[
                    styles.primary,
                    { color: tint ?? sky.textPrimary },
                    t.major && styles.primaryMajor,
                  ]}
                >
                  {t.primary}°{t.major ? primaryUnit : ''}
                </Text>
                <View style={styles.band}>
                  {t.c === 0 ? (
                    <View style={[styles.freeze, { backgroundColor: FREEZE }]} />
                  ) : (
                    <View
                      style={[
                        styles.vtick,
                        t.major
                          ? [styles.vtickMajor, { backgroundColor: tint }]
                          : { backgroundColor: sky.textSecondary },
                      ]}
                    />
                  )}
                </View>
                <Text style={[styles.secondary, { color: sky.textSecondary }]}>
                  {t.secondary}°{t.major ? secondaryUnit : ''}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heading: {
    fontFamily: Font.semibold,
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 7,
    marginLeft: 2,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
  },
  // The header cell doubles as the left padding and hosts the axis; stretched
  // to full height so the axis's `top` is measured from the ruler's top edge.
  headerCell: {
    width: HPAD,
    alignSelf: 'stretch',
  },
  // Spans the full ruler from the header cell; centred on the tick band
  // (primary height 16 + half of band height 13 ≈ 22.5).
  axis: {
    position: 'absolute',
    left: 0,
    width: CONTENT_W,
    top: 21,
    height: 3,
    borderRadius: 2,
    opacity: 0.9,
  },
  tick: {
    width: TICK_W,
    alignItems: 'center',
  },
  primary: {
    fontFamily: Font.tightSemibold,
    fontSize: 13,
    height: 16,
    lineHeight: 16,
    textAlign: 'center',
    includeFontPadding: false,
  },
  primaryMajor: {
    fontFamily: Font.tightBold,
    fontSize: 14,
  },
  band: {
    height: 13,
    justifyContent: 'center',
  },
  vtick: {
    width: StyleSheet.hairlineWidth,
    height: 6,
    opacity: 0.4,
  },
  vtickMajor: {
    width: 1.5,
    height: 12,
    borderRadius: 1,
    opacity: 1,
  },
  freeze: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  secondary: {
    fontFamily: Font.tightMedium,
    fontSize: 10,
    height: 14,
    lineHeight: 14,
    textAlign: 'center',
    opacity: 0.8,
    includeFontPadding: false,
  },
});
