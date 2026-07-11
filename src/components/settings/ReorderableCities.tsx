/**
 * Drag-to-reorder list of saved cities, built on core React Native `Animated` +
 * `PanResponder` (no reanimated/gesture-handler dependency, so it needs no babel
 * or root-view setup). The list is short (≤ MAX_SAVED_CITIES), so each row is
 * absolutely positioned by index; dragging a row by its handle opens a gap and
 * commits the new order on release.
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import type { SavedCity } from '@/state/locations';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import type { SettingsPalette } from '@/theme/settingsTheme';

const ROW_H = 64; // card height
const GAP = 10; // vertical gap between cards
const ITEM_H = ROW_H + GAP; // pitch per slot

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function ReorderableCities({
  cities,
  colors,
  onReorder,
  onRemove,
}: {
  cities: SavedCity[];
  colors: SettingsPalette;
  onReorder: (next: SavedCity[]) => void;
  onRemove: (id: number) => void;
}) {
  const { strings } = useSettings();

  // Local working copy. Reset only when membership changes (add/remove
  // elsewhere), never on a pure reorder we performed ourselves.
  const [data, setData] = useState<SavedCity[]>(cities);
  const memberKey = useMemo(
    () => [...cities].map((c) => c.id).sort((a, b) => a - b).join(','),
    [cities],
  );
  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync to external membership changes
  useEffect(() => setData(cities), [memberKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const [activeId, setActiveId] = useState<number | null>(null);
  const dragY = useMemo(() => new Animated.Value(0), []);
  // Per-slot gap offsets (fixed max length; indexed by current row position).
  const offsets = useMemo(() => Array.from({ length: 8 }, () => new Animated.Value(0)), []);
  const fromIndex = useRef<number | null>(null);
  const lastTo = useRef(-1);

  const applyGap = useCallback(
    (from: number, to: number) => {
      const n = dataRef.current.length;
      for (let j = 0; j < n; j++) {
        if (j === from) continue;
        let target = 0;
        if (from < to && j > from && j <= to) target = -ITEM_H;
        else if (from > to && j >= to && j < from) target = ITEM_H;
        Animated.spring(offsets[j], {
          toValue: target,
          useNativeDriver: true,
          bounciness: 0,
          speed: 24,
        }).start();
      }
    },
    [offsets],
  );

  const onStart = useCallback(
    (index: number) => {
      fromIndex.current = index;
      lastTo.current = index;
      dragY.setValue(0);
      offsets.forEach((o) => o.setValue(0));
      setActiveId(dataRef.current[index]?.id ?? null);
    },
    [dragY, offsets],
  );

  const onMove = useCallback(
    (dy: number) => {
      const from = fromIndex.current;
      if (from == null) return;
      dragY.setValue(dy);
      const n = dataRef.current.length;
      const to = clamp(from + Math.round(dy / ITEM_H), 0, n - 1);
      if (to !== lastTo.current) {
        lastTo.current = to;
        applyGap(from, to);
      }
    },
    [dragY, applyGap],
  );

  const onEnd = useCallback(
    (dy: number) => {
      const from = fromIndex.current;
      if (from == null) return;
      const n = dataRef.current.length;
      const to = clamp(from + Math.round(dy / ITEM_H), 0, n - 1);

      const next = [...dataRef.current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);

      fromIndex.current = null;
      lastTo.current = -1;
      dragY.setValue(0);
      offsets.forEach((o) => o.setValue(0));
      setActiveId(null);

      if (to !== from) {
        setData(next);
        onReorder(next);
      }
    },
    [dragY, offsets, onReorder],
  );

  if (data.length === 0) {
    return (
      <Text style={[styles.empty, { color: colors.subtext }]}>{strings.noCities}</Text>
    );
  }

  return (
    <View style={[styles.container, { height: data.length * ITEM_H - GAP }]}>
      {data.map((city, index) => (
        <CityRow
          key={city.id}
          city={city}
          index={index}
          colors={colors}
          active={activeId === city.id}
          dragY={dragY}
          offset={offsets[index]}
          onStart={onStart}
          onMove={onMove}
          onEnd={onEnd}
          onRemove={onRemove}
          removeLabel={strings.remove}
        />
      ))}
    </View>
  );
}

function CityRow({
  city,
  index,
  colors,
  active,
  dragY,
  offset,
  onStart,
  onMove,
  onEnd,
  onRemove,
  removeLabel,
}: {
  city: SavedCity;
  index: number;
  colors: SettingsPalette;
  active: boolean;
  dragY: Animated.Value;
  offset: Animated.Value;
  onStart: (index: number) => void;
  onMove: (dy: number) => void;
  onEnd: (dy: number) => void;
  onRemove: (id: number) => void;
  removeLabel: string;
}) {
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 2,
        onPanResponderGrant: () => onStart(index),
        onPanResponderMove: (_, g) => onMove(g.dy),
        onPanResponderRelease: (_, g) => onEnd(g.dy),
        onPanResponderTerminate: (_, g) => onEnd(g.dy),
      }),
    [index, onStart, onMove, onEnd],
  );

  const sub = [city.region, city.country].filter(Boolean).join(', ');

  return (
    <Animated.View
      style={[
        styles.rowWrap,
        {
          top: index * ITEM_H,
          transform: [{ translateY: active ? dragY : offset }],
          zIndex: active ? 20 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: active ? colors.accent : colors.border,
          },
          active && styles.cardActive,
        ]}
      >
        <View style={styles.cardText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {city.name}
          </Text>
          {!!sub && (
            <Text style={[styles.sub, { color: colors.subtext }]} numberOfLines={1}>
              {sub}
            </Text>
          )}
        </View>

        <Pressable
          onPress={() => onRemove(city.id)}
          hitSlop={10}
          accessibilityLabel={`${removeLabel} ${city.name}`}
          style={styles.removeBtn}
        >
          <FontAwesome name="minus-circle" size={20} color={colors.danger} />
        </Pressable>

        <View {...pan.panHandlers} style={styles.handle} hitSlop={8}>
          <FontAwesome name="bars" size={16} color={colors.handle} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  empty: {
    fontFamily: Font.medium,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
  rowWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ROW_H,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 10,
  },
  cardActive: {
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cardText: {
    flex: 1,
  },
  name: {
    fontFamily: Font.semibold,
    fontSize: 15,
  },
  sub: {
    fontFamily: Font.regular,
    fontSize: 12,
    marginTop: 2,
  },
  removeBtn: {
    padding: 6,
  },
  handle: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
});
