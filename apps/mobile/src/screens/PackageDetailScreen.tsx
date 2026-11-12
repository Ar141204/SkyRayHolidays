import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { API, TourPackage, getFallbackPackage, getPackageImage } from '../lib/api';
import { C, PrimaryButton, BrandHeader, Badge } from '../components/UI';

export function PackageDetailScreen({ route, navigation }: any) {
  const [item, setItem] = useState<TourPackage | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const slug = route.params?.slug;

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    fetch(`${API}/packages/${slug}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Package not found'))))
      .then((data) => {
        clearTimeout(timer);
        setItem(data);
        setIsOffline(false);
      })
      .catch(() => {
        clearTimeout(timer);
        setItem(getFallbackPackage(slug));
        setIsOffline(true);
      });
  }, [slug]);

  if (!item) {
    return (
      <View style={s.centerPage}>
        <ActivityIndicator color={C.sky} size="large" />
        <Text style={s.loadingText}>Loading itinerary details...</Text>
      </View>
    );
  }

  const inclusions = Array.isArray(item.inclusions) && item.inclusions.length > 0
    ? item.inclusions
    : ['Deluxe Hotel Stays', 'Daily Breakfast', 'Private AC Vehicle Sightseeing', 'Airport Transfers'];

  const exclusions = Array.isArray(item.exclusions) && item.exclusions.length > 0
    ? item.exclusions
    : ['Personal Expenses', 'Monument Entry Tickets', 'Lunch & Dinner unless specified'];

  const isDomestic =
    item.category === 'Domestic' ||
    item.destination.includes('India') ||
    item.slug.includes('kashmir') ||
    item.slug.includes('kerala') ||
    item.slug.includes('andaman') ||
    item.slug.includes('goa') ||
    item.slug.includes('golden-triangle');

  const isPilgrim = item.kind === 'HAJJ' || item.kind === 'UMRAH';

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hello SkyRay Holidays! I would like to enquire about the ${item.title}.`);
    Linking.openURL(`https://wa.me/919876543210?text=${text}`).catch(() => {});
  };

  return (
    <View style={s.container}>
      <BrandHeader
        subtitle="Itinerary Details"
        onContactPress={handleWhatsApp}
      />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back navigation link */}
        <View style={s.topNavRow}>
          <TouchableOpacity
            style={s.backBar}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={s.backArrow}>‹</Text>
            <Text style={s.backText}>Back to all packages</Text>
          </TouchableOpacity>

          {isOffline && (
            <View style={s.offlineChip}>
              <View style={s.offlineDot} />
              <Text style={s.offlineChipText}>Verified Offline Cache</Text>
            </View>
          )}
        </View>

        {/* Visual Travel Photo Hero Frame */}
        <View style={s.photoHeroFrame}>
          <Image
            source={getPackageImage(item.slug)}
            style={s.photoHeroImg}
            resizeMode="cover"
          />
          <View style={s.photoHeroOverlay} />
          <View style={s.photoHeroTopBadge}>
            <Badge
              label={isPilgrim ? 'PILGRIMAGE' : isDomestic ? 'DOMESTIC (INDIA)' : 'INTERNATIONAL'}
              variant={isPilgrim ? 'gold' : isDomestic ? 'sky' : 'neutral'}
            />
          </View>
          <View style={s.photoHeroDuration}>
            <Text style={s.photoHeroDurationText}>⏱ {item.duration}</Text>
          </View>
        </View>

        {/* Hero Card */}
        <View style={s.heroCard}>
          <Text style={s.heroTitle}>{item.title}</Text>
          <Text style={s.heroDestination}>📍 {item.destination}</Text>

          <View style={s.ratingStrip}>
            <Text style={s.stars}>★★★★★</Text>
            <Text style={s.ratingNum}>4.9</Text>
            <Text style={s.reviewsText}>(120+ verified reviews)</Text>
          </View>
        </View>

        {/* Price on Enquiry CTA Banner */}
        <View style={s.priceBox}>
          <View style={s.priceHeader}>
            <View>
              <Text style={s.priceLabel}>Custom Quotation</Text>
              <Text style={s.priceAmount}>Price on Enquiry</Text>
              <Text style={s.priceSub}>Personalized quotes for your exact travel dates</Text>
            </View>
          </View>

          <View style={s.actionRow}>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                title="Enquire for this Package →"
                onPress={() =>
                  navigation.navigate('Enquiry', {
                    packageId: item.id,
                    packageName: item.title,
                  })
                }
              />
            </View>
            <TouchableOpacity
              style={s.waBtn}
              onPress={handleWhatsApp}
              activeOpacity={0.8}
            >
              <Text style={s.waIcon}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview Section */}
        <View style={s.sectionCard}>
          <Text style={s.sectionHeading}>Trip Overview</Text>
          <Text style={s.bodyText}>{item.description || item.summary}</Text>
        </View>

        {/* Inclusions Card */}
        <View style={s.sectionCard}>
          <Text style={s.sectionHeading}>What&apos;s Included</Text>
          <View style={s.checkList}>
            {inclusions.map((inc, i) => (
              <View key={i} style={s.checkRow}>
                <Text style={s.greenCheck}>✔</Text>
                <Text style={s.checkText}>
                  {typeof inc === 'string' ? inc : JSON.stringify(inc)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Exclusions Card */}
        <View style={s.sectionCard}>
          <Text style={s.sectionHeading}>Not Included</Text>
          <View style={s.checkList}>
            {exclusions.map((exc, i) => (
              <View key={i} style={s.checkRow}>
                <Text style={s.grayCross}>✕</Text>
                <Text style={[s.checkText, { color: '#64748b' }]}>
                  {typeof exc === 'string' ? exc : JSON.stringify(exc)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Floating Bottom Help Note */}
        <View style={s.helpCard}>
          <Text style={s.helpTitle}>Need Custom Itineraries?</Text>
          <Text style={s.helpBody}>
            Want to add extra days, upgrade to a luxury hotel, or travel with a large family group? Our travel specialists will customize this itinerary for you.
          </Text>
          <TouchableOpacity
            style={s.helpLink}
            onPress={() =>
              navigation.navigate('Enquiry', {
                packageName: item.title,
              })
            }
          >
            <Text style={s.helpLinkText}>Request Custom Itinerary →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: C.muted,
    fontSize: 13,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  offlineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  offlineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0ea5e9',
    marginRight: 6,
  },
  offlineChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  backArrow: {
    fontSize: 22,
    color: C.skyDark,
    marginRight: 6,
    fontWeight: '700',
  },
  backText: {
    fontSize: 13,
    color: C.skyDark,
    fontWeight: '700',
  },
  photoHeroFrame: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0f172a',
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  photoHeroImg: {
    width: '100%',
    height: '100%',
  },
  photoHeroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
  },
  photoHeroTopBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 2,
  },
  photoHeroDuration: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    zIndex: 2,
  },
  photoHeroDurationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  durationBadge: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: C.deep,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  heroDestination: {
    fontSize: 13,
    color: C.muted,
    fontWeight: '600',
    marginTop: 6,
  },
  ratingStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  stars: {
    color: '#d97706',
    fontSize: 13,
    marginRight: 6,
  },
  ratingNum: {
    fontWeight: '800',
    fontSize: 13,
    color: C.deep,
    marginRight: 6,
  },
  reviewsText: {
    color: '#64748b',
    fontSize: 12,
  },
  priceBox: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#e0f2fe',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  priceHeader: {
    marginBottom: 14,
  },
  priceLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0369a1',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: C.deep,
    marginTop: 2,
  },
  priceSub: {
    fontSize: 12,
    color: C.muted,
    marginTop: 3,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  waBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  waIcon: {
    fontSize: 20,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: C.deep,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#334155',
  },
  checkList: {
    gap: 10,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  greenCheck: {
    color: '#16a34a',
    fontWeight: '900',
    fontSize: 13,
    marginRight: 8,
    marginTop: 1,
  },
  grayCross: {
    color: '#94a3b8',
    fontWeight: '900',
    fontSize: 12,
    marginRight: 8,
    marginTop: 2,
  },
  checkText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  helpCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 18,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0369a1',
    marginBottom: 4,
  },
  helpBody: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 10,
  },
  helpLink: {
    alignSelf: 'flex-start',
  },
  helpLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.skyDark,
  },
});
