import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getPackages, TourPackage } from '../lib/api';
import { C, ScreenTitle } from '../components/UI';

const CATEGORIES = ['All', 'International', 'Domestic'];

export function PackagesScreen({ navigation }: any) {
  const [items, setItems] = useState<TourPackage[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPackages()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter(
      (p) =>
        (p.category && p.category.toLowerCase() === activeCategory.toLowerCase()) ||
        (activeCategory === 'International' && p.kind === 'TOUR' && p.category !== 'Domestic') ||
        (activeCategory === 'Domestic' && p.category === 'Domestic'),
    );
  }, [items, activeCategory]);

  return (
    <View style={s.page}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <ScreenTitle
          eyebrow="Find your escape"
          title="Packages"
          body="Explore our carefully curated holiday and pilgrimage itineraries."
        />

        {/* Category Filter Pills matching Mobile Preview Screen 3 */}
        <View style={s.pillsRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[s.pill, activeCategory === cat && s.activePill]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[s.pillText, activeCategory === cat && s.activePillText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={C.sky} style={{ marginTop: 40 }} />
      ) : error && filtered.length === 0 ? (
        <Text style={s.empty}>{error}. Check your API connection.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(x) => x.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.card}
              onPress={() => (navigation.getParent?.() || navigation).navigate('PackageDetail', { slug: item.slug })}
            >
              <View style={s.art}>
                <Text style={{ fontSize: 28 }}>
                  {item.kind === 'HAJJ' || item.kind === 'UMRAH' ? '☾' : '✈'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.title}>{item.title}</Text>
                <Text style={s.meta}>{item.duration} · Price on Enquiry</Text>
                <Text style={s.body} numberOfLines={2}>{item.summary}</Text>
                <Text style={s.link}>View details →</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={s.empty}>No packages found in this category.</Text>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  pillsRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 8 },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F6F9',
    borderWidth: 1,
    borderColor: '#E1EDF3',
  },
  activePill: { backgroundColor: C.sky, borderColor: C.sky },
  pillText: { fontSize: 12, fontWeight: '700', color: C.deep },
  activePillText: { color: '#fff' },
  card: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    padding: 12,
    gap: 13,
    backgroundColor: '#FAFDFE',
  },
  art: {
    width: 72,
    height: 85,
    borderRadius: 6,
    backgroundColor: C.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 15, fontWeight: '900', color: C.deep },
  meta: { fontSize: 11, color: C.sky, marginVertical: 3, fontWeight: '800' },
  body: { fontSize: 11, color: C.muted, lineHeight: 16 },
  link: { fontSize: 11, color: C.sky, fontWeight: '900', marginTop: 6 },
  empty: { padding: 25, color: C.muted, fontSize: 13, textAlign: 'center' },
});
