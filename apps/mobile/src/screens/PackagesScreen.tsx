import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { getPackagesWithStatus, TourPackage, getPackageImage } from '../lib/api';
import { C, BrandHeader, Badge } from '../components/UI';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'All', label: 'All Escapes', icon: 'compass-outline' },
  { id: 'Domestic', label: 'Within India', icon: 'map-outline' },
  { id: 'International', label: 'International', icon: 'airplane-outline' },
  { id: 'Pilgrimage', label: 'Pilgrimage', icon: 'moon-outline' },
];

export function PackagesScreen({ navigation }: any) {
  const [items, setItems] = useState<TourPackage[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    getPackagesWithStatus()
      .then((res) => {
        setItems(res.packages);
        setIsOffline(res.isOffline);
      })
      .catch((e) => {
        setError(e.message);
        setIsOffline(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const matchesCategory =
        activeCategory === 'All' ||
        (activeCategory === 'Domestic' &&
          (p.category === 'Domestic' ||
            p.destination.includes('India') ||
            p.slug.includes('kashmir') ||
            p.slug.includes('kerala') ||
            p.slug.includes('golden-triangle') ||
            p.slug.includes('andaman') ||
            p.slug.includes('goa'))) ||
        (activeCategory === 'International' &&
          (p.category === 'International' || (!p.category && p.kind === 'TOUR'))) ||
        (activeCategory === 'Pilgrimage' &&
          (p.kind === 'HAJJ' || p.kind === 'UMRAH' || p.category === 'Pilgrimage'));

      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  // Reliable navigation handler for both card tap and explicit button click
  const navigateToPackage = (slug: string) => {
    try {
      navigation.navigate('PackageDetail', { slug });
    } catch {
      try {
        navigation.getParent?.()?.navigate('PackageDetail', { slug });
      } catch (e) {
        console.warn('Navigation error:', e);
      }
    }
  };

  return (
    <View style={s.container}>
      <BrandHeader
        subtitle="Curated Travel Packages"
        onContactPress={() => navigation.navigate('Contact')}
      />

      <View style={s.filterHeader}>
        {/* Search Bar */}
        <View style={s.searchBar}>
          <Ionicons name="search-outline" size={17} color="#64748b" style={s.searchIcon} />
          <TextInput
            style={s.searchInput}
            placeholder="Search dream destinations (e.g. Kashmir, Maldives, Kerala)..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={s.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Pills */}
        <View style={s.pillsRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[s.pill, activeCategory === cat.id && s.activePill]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={cat.icon}
                size={14}
                color={activeCategory === cat.id ? '#0284c7' : '#64748b'}
                style={{ marginRight: 5 }}
              />
              <Text style={[s.pillText, activeCategory === cat.id && s.activePillText]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Discreet Offline Notice Banner */}
        {isOffline && (
          <View style={s.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={13} color="#0ea5e9" style={{ marginRight: 6 }} />
            <Text style={s.offlineText}>
              Offline Catalog &bull; Showing 14 verified travel itineraries
            </Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={s.centerBox}>
          <ActivityIndicator color={C.sky} size="large" />
          <Text style={s.loadingText}>Unfolding travel itineraries...</Text>
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
            const cardImage = getPackageImage(item.slug);

            return (
              <TouchableOpacity
                style={s.card}
                activeOpacity={0.92}
                onPress={() => navigateToPackage(item.slug)}
              >
                {/* Visual Travel Photography Banner */}
                <View style={s.imageFrame}>
                  <Image
                    source={cardImage}
                    style={s.coverImage}
                    resizeMode="cover"
                  />
                  {/* Visual Gradient Vignette */}
                  <View style={s.imageGradientOverlay} />

                  {/* Floating Badges */}
                  <View style={s.floatingTopRow}>
                    <View
                      style={[
                        s.categoryTag,
                        isPilgrim
                          ? s.categoryTagGold
                          : isDomestic
                          ? s.categoryTagSky
                          : s.categoryTagNavy,
                      ]}
                    >
                      <Ionicons
                        name={isPilgrim ? 'moon' : isDomestic ? 'map' : 'airplane'}
                        size={10}
                        color="#ffffff"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={s.categoryTagText}>
                        {isPilgrim
                          ? 'PILGRIMAGE'
                          : isDomestic
                          ? 'DOMESTIC'
                          : 'INTERNATIONAL'}
                      </Text>
                    </View>

                    <View style={s.ratingBadge}>
                      <Ionicons name="star" size={12} color="#f59e0b" style={{ marginRight: 3 }} />
                      <Text style={s.ratingScore}>4.9</Text>
                    </View>
                  </View>

                  <View style={s.floatingBottomRow}>
                    <View style={s.durationPill}>
                      <Ionicons name="time-outline" size={12} color="#ffffff" style={{ marginRight: 4 }} />
                      <Text style={s.durationText}>{item.duration}</Text>
                    </View>
                  </View>
                </View>

                {/* Card Content */}
                <View style={s.cardBody}>
                  <Text style={s.title}>{item.title}</Text>
                  <View style={s.destinationRow}>
                    <Ionicons name="location-outline" size={13} color="#0ea5e9" style={{ marginRight: 4 }} />
                    <Text style={s.destination}>{item.destination}</Text>
                  </View>

                  <Text style={s.summary} numberOfLines={2}>
                    {item.summary}
                  </Text>

                  {/* Card Footer with Fixed, Prominent View Details Button */}
                  <View style={s.cardFooter}>
                    <View style={s.priceBox}>
                      <Text style={s.priceEyebrow}>CUSTOM QUOTE</Text>
                      <Text style={s.priceValue}>Price on Enquiry</Text>
                    </View>

                    {/* Dedicated, High-Contrast View Details Button */}
                    <TouchableOpacity
                      style={s.viewDetailsBtn}
                      onPress={() => navigateToPackage(item.slug)}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityLabel={`View details for ${item.title}`}
                    >
                      <Text style={s.viewDetailsText}>View Details</Text>
                      <Ionicons name="arrow-forward" size={14} color="#ffffff" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={s.emptyContainer}>
              <Ionicons name="search-outline" size={38} color="#94a3b8" style={{ marginBottom: 10 }} />
              <Text style={s.emptyTitle}>No packages found</Text>
              <Text style={s.emptyBody}>
                Try adjusting your search query or choosing another destination category.
              </Text>
              <TouchableOpacity
                style={s.resetBtn}
                onPress={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
              >
                <Text style={s.resetBtnText}>Explore All Packages</Text>
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
    height: 44,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    fontWeight: '500',
  },
  clearBtn: {
    padding: 6,
  },
  clearText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '700',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activePill: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0284c7',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748b',
  },
  activePillText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  imageFrame: {
    width: '100%',
    height: 180,
    backgroundColor: '#0f172a',
    position: 'relative',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageGradientOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  floatingTopRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  categoryTag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  categoryTagSky: {
    backgroundColor: 'rgba(2, 132, 199, 0.9)',
  },
  categoryTagGold: {
    backgroundColor: 'rgba(217, 119, 6, 0.92)',
  },
  categoryTagNavy: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  categoryTagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  ratingStar: {
    color: '#f59e0b',
    fontSize: 12,
    marginRight: 3,
  },
  ratingScore: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
  },
  floatingBottomRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    zIndex: 2,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  durationIcon: {
    fontSize: 11,
    marginRight: 5,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f2942',
    lineHeight: 23,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  destination: {
    fontSize: 12.5,
    color: '#64748b',
    fontWeight: '600',
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summary: {
    fontSize: 13,
    lineHeight: 19,
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
    marginTop: 4,
  },
  priceBox: {
    flex: 1,
  },
  priceEyebrow: {
    fontSize: 9.5,
    color: '#0284c7',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f2942',
    marginTop: 1,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  viewDetailsText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginRight: 6,
    letterSpacing: 0.2,
  },
  viewDetailsArrow: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
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
    fontSize: 40,
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
    backgroundColor: '#0ea5e9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  offlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0ea5e9',
    marginRight: 8,
  },
  offlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.1,
  },
});
