import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { composeBriefing, phraseBankFor, type BriefingPage } from '@/briefing';
import type { WeatherData } from '@/services/weatherApi';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import type { SkyTheme } from '@/theme/sky';

const HOUR_MS = 3_600_000;
/** Accent for the alert tone — the air quality card's "poor" colour. */
const ALERT_COLOR = '#F2765C';
/** Horizontal travel (px) that turns a drag into a page change. */
const SWIPE_THRESHOLD = 40;

/**
 * "Your day in short": a few plain-language lines about what's coming — when
 * the rain starts, how cold the morning is, what to bring — right under the
 * hero. Two pages, today (or tonight) and the next day, switched with the tabs
 * or a horizontal swipe. Rebuilt when the forecast, language or unit order
 * changes, and when the clock ticks into a new hour (so 2 pm's rain stops
 * being "later").
 *
 * Mount it with a `key` per location so each city opens on its first page.
 */
export function DailyBriefing({ data, sky }: { data: WeatherData; sky: SkyTheme }) {
  const { language, tempOrder, strings, isRTL } = useSettings();
  const nowMs = useHourlyClock();

  const briefing = useMemo(
    () =>
      composeBriefing(data, {
        bank: phraseBankFor(language),
        strings,
        order: tempOrder,
        nowMs,
      }),
    [data, language, strings, tempOrder, nowMs],
  );
  const pages = useMemo(() => briefing?.pages.filter((p) => p.lines.length) ?? [], [briefing]);

  const [requested, setRequested] = useState(0);
  // The hour can roll over (e.g. past midnight) and take page 2 with it.
  const page = Math.min(requested, Math.max(0, pages.length - 1));
  const { slide, fade, panHandlers, goTo } = usePager(page, pages.length, setRequested);

  if (!briefing || !pages.length) return null;
  const current = pages[page];
  const alert = current.tone === 'alert';
  const align = isRTL ? ({ textAlign: 'right', writingDirection: 'rtl' } as const) : null;

  return (
    <View style={styles.wrap}>
      <View
        {...panHandlers}
        style={[
          styles.card,
          { backgroundColor: sky.cardBg, borderColor: alert ? ALERT_COLOR : sky.cardBorder },
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: sky.textSecondary }]} numberOfLines={1}>
            {briefing.title.toUpperCase()}
          </Text>
          {pages.length > 1 && (
            <Tabs pages={pages} active={page} sky={sky} onPress={goTo} />
          )}
        </View>

        <Animated.View style={{ opacity: fade, transform: [{ translateX: slide }] }}>
          <Text style={[styles.heading, { color: alert ? ALERT_COLOR : sky.textPrimary }, align]}>
            {alert ? '⚠️ ' : ''}
            {current.heading}
          </Text>
          {current.lines.map((line) => (
            <Text key={line} style={[styles.line, { color: sky.textPrimary }, align]}>
              {line}
            </Text>
          ))}
          {!!current.tip && (
            <Text style={[styles.tip, { color: sky.textSecondary }, align]}>💡 {current.tip}</Text>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

function Tabs({
  pages,
  active,
  sky,
  onPress,
}: {
  pages: BriefingPage[];
  active: number;
  sky: SkyTheme;
  onPress: (index: number) => void;
}) {
  return (
    <View style={[styles.tabs, { backgroundColor: sky.tabInactiveBg }]}>
      {pages.map((p, i) => {
        const selected = i === active;
        return (
          <Pressable
            key={p.label}
            onPress={() => onPress(i)}
            hitSlop={6}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.tab, selected && { backgroundColor: sky.tabActiveBg }]}
          >
            <Text
              style={[styles.tabText, { color: selected ? sky.tabActiveFg : sky.tabInactiveFg }]}
              numberOfLines={1}
            >
              {p.label}
            </Text>
            {/* Something dangerous on the page you're not looking at. */}
            {!selected && p.tone === 'alert' && <View style={styles.alertDot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Page switching: tabs call `goTo`; a horizontal drag nudges the content with
 * the finger and flips the page past a threshold (left = next). Vertical drags
 * are left alone so the screen still scrolls.
 */
function usePager(page: number, count: number, setPage: (p: number) => void) {
  const slide = useMemo(() => new Animated.Value(0), []);
  const fade = useMemo(() => new Animated.Value(1), []);

  const goTo = useCallback(
    (next: number) => {
      if (next === page || next < 0 || next >= count) {
        Animated.spring(slide, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
        return;
      }
      // Card height follows the new page's content smoothly.
      LayoutAnimation.configureNext(LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'));
      setPage(next);
      // The new page comes in from the side it lives on.
      slide.setValue(next > page ? 28 : -28);
      fade.setValue(0);
      Animated.parallel([
        Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    },
    [page, count, slide, fade, setPage],
  );

  // Rebuilt on each page change (it closes over `page`); that only happens
  // between gestures, never during one.
  const panHandlers = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
        onPanResponderMove: (_, g) => {
          // Resist when there's no page in that direction.
          const blocked = (g.dx < 0 && page >= count - 1) || (g.dx > 0 && page <= 0);
          slide.setValue(g.dx * (blocked ? 0.12 : 0.35));
        },
        onPanResponderRelease: (_, g) => {
          if (g.dx <= -SWIPE_THRESHOLD) goTo(page + 1);
          else if (g.dx >= SWIPE_THRESHOLD) goTo(page - 1);
          else goTo(page);
        },
        onPanResponderTerminate: () => {
          Animated.spring(slide, { toValue: 0, useNativeDriver: true }).start();
        },
      }).panHandlers,
    [page, count, slide, goTo],
  );

  return { slide, fade, panHandlers, goTo };
}

/** Current time, updated only when the hour changes. */
function useHourlyClock(): number {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => {
      const next = Date.now();
      setNowMs((prev) => (Math.floor(prev / HOUR_MS) === Math.floor(next / HOUR_MS) ? prev : next));
    }, 60_000);
    return () => clearInterval(id);
  }, []);
  return nowMs;
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 2,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontFamily: Font.semibold,
    fontSize: 10,
    letterSpacing: 0.4,
    opacity: 0.78,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 2,
    flexShrink: 0,
    maxWidth: '65%',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 1,
  },
  tabText: {
    fontFamily: Font.semibold,
    fontSize: 11,
  },
  alertDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 5,
    backgroundColor: ALERT_COLOR,
  },
  heading: {
    fontFamily: Font.tightSemibold,
    fontSize: 16,
    lineHeight: 21,
    marginBottom: 6,
  },
  line: {
    fontFamily: Font.regular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 3,
  },
  tip: {
    fontFamily: Font.medium,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
});
