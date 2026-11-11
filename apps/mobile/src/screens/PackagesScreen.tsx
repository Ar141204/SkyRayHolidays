import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { getPackages, TourPackage } from '../lib/api';
import { C, BrandHeader, Badge } from '../components/UI';

const CATEGORIES = [
  { id: 'All', label: 'All Packages' },
  { id: 'Domestic', label: '🇮🇳 Within India' },
  { id: 'International', label: '✈ International' },
  { id: 'Pilgrimage', label: '☾ Pilgrimage' },
];

export function PackagesScreen({ navigation }: any) {
  const [items, setItems] = useState<TourPackage[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPackages()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      // Category filter
      const matchesCategory =
        activeCategory === 'All' ||
        (activeCategory === 'Domestic' && (p.category === 'Domestic' || p.destination.includes('India') || p.slug.includes('kashmir') || p.slug.includes('kerala') || p.slug.includes('golden-triangle') || p.slug.includes('andaman') || p.slug.includes('goa'))) ||
        (activeCategory === 'International' && (p.category === 'International' || (!p.category && p.kind === 'TOUR'))) ||
        (activeCategory === 'Pilgrimage' && (p.kind === 'HAJJ' || p.kind === 'UMRAH' || p.category === 'Pilgrimage'));

      // Search filter
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  const navigateToPackage = (slug: string) => {
    (navigation.getParent?.() || navigation).navigate('PackageDetail', { slug });
  };

  return (
    <View style={s.container}>
      <BrandHeader
        subtitle="Curated Travel Packages"
        onContactPress={() => navigation.navigate('Contact')}
      />

      <View style={s.filterHeader}>
        {/* Search Input Field */}
        <View style={s.searchBar}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search destinations (e.g. Kashmir, Dubai, Kerala)..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={s.clearBtn}>
              <Text style={s.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Pills Strip */}
        <View style={s.pillsRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[s.pill, activeCategory === cat.id && s.activePill]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.8}
            >
              <Text style={[s.pillText, activeCategory === cat.id && s.activePillText]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={s.centerBox}>
          <ActivityIndicator color={C.sky} size="large" />
          <Text style={s.loadingText}>Loading tour packages...</Text>
        </View>
      ) : error && filtered.length === 0 ? (
        <View style={s.centerBox}>
          <Text style={s.empty}>{error}. Check your connection.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(x) => x.id}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isDomestic =
              item.category === 'Domestic' ||
              item.destination.includes('India') ||
              item.slug.includes('kashmir') ||
              item.slug.includes('kerala') ||
              item.slug.includes('andaman');

            const isPilgrim = item.kind === 'HAJJ' || item.kind === 'UMRAH';

            return (
              <TouchableOpacity
                style={s.card}
                activeOpacity={0.9}
                onPress={() => navigateToPackage(item.slug)}
              >
                <View style={s.cardTopRow}>
                  <Badge
                    label={isPilgrim ? 'PILGRIMAGE' : isDomestic ? 'DOMESTIC (INDIA)' : 'INTERNATIONAL'}
                    variant={isPilgrim ? 'gold' : isDomestic ? 'sky' : 'neutral'}
                  />
                  <Text style={s.durationPill}>{item.duration}</Text>
                </View>

                <Text style={s.title}>{item.title}</Text>
                <Text style={s.destination}>📍 {item.destination}</Text>

                <Text style={s.summary} numberOfLines={2}>
                  {item.summary}
                </Text>

                <View style={s.cardFooter}>
                  <View>
                    <Text style={s.priceLabel}>Custom Itinerary</Text>
                    <Text style={s.priceValue}>Price on Enquiry</Text>
                  </View>

                  <View style={s.viewBtn}>
                    <Text style={s.viewBtnText}>View Itinerary →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={s.emptyContainer}>
              <Text style={s.emptyIcon}>✈</Text>
              <Text style={s.emptyTitle}>No packages found</Text>
              <Text style={s.emptyBody}>
                Try adjusting your search query or switching categories.
              </Text>
              <TouchableOpacity
                style={s.resetBtn}
                onPress={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
              >
                <Text style={s.resetBtnText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  filterHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    color: '#64748b',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: C.deep,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '700',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activePill: {
    backgroundColor: '#e0f2fe',
    borderColor: '#38bdf8',
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748b',
  },
  activePillText: {
    color: '#0369a1',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  durationPill: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: C.deep,
    lineHeight: 22,
    marginBottom: 4,
  },
  destination: {
    fontSize: 12,
    color: C.muted,
    marginBottom: 8,
    fontWeight: '600',
  },
  summary: {
    fontSize: 13,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '800',
    color: C.deep,
  },
  viewBtn: {
    backgroundColor: '#f0f9ff',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewBtnText: {
    color: C.skyDark,
    fontSize: 12,
    fontWeight: '800',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: C.muted,
    fontSize: 13,
  },
  empty: {
    color: C.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 36,
    color: '#cbd5e1',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.deep,
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 13,
    color: C.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  resetBtn: {
    backgroundColor: C.sky,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
});
