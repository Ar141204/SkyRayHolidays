import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { BrandHeader, PrimaryButton, C, Badge } from '../components/UI';
import { getPackageImage } from '../lib/api';

const FEATURED_TOURS = [
  {
    id: '1',
    title: 'Kashmir Paradise Experience',
    slug: 'kashmir-paradise',
    destination: 'Srinagar, Gulmarg & Pahalgam',
    category: 'Domestic',
    duration: '6 Days / 5 Nights',
    rating: 4.9,
    highlights: ['Dal Lake Shikara', 'Gulmarg Gondola', 'Luxury Houseboat'],
    icon: '🏔',
  },
  {
    id: '2',
    title: 'Kerala God’s Own Country',
    slug: 'kerala-backwaters',
    destination: 'Munnar, Thekkady & Alleppey',
    category: 'Domestic',
    duration: '6 Days / 5 Nights',
    rating: 4.9,
    highlights: ['Tea Gardens', 'Spice Plantation', 'Private Houseboat'],
    icon: '🌴',
  },
  {
    id: '3',
    title: 'Dubai Holiday Package',
    slug: 'dubai-holiday',
    destination: 'Dubai, UAE',
    category: 'International',
    duration: '5 Days / 4 Nights',
    rating: 4.8,
    highlights: ['Burj Khalifa', 'Desert Safari BBQ', 'Marina Cruise'],
    icon: '✈',
  },
  {
    id: '4',
    title: 'Sri Lanka Wonder Island',
    slug: 'sri-lanka-wonder',
    destination: 'Colombo, Kandy & Bentota',
    category: 'International',
    duration: '6 Days / 5 Nights',
    rating: 4.9,
    highlights: ['Tooth Relic Temple', 'Tea Estates', 'Bentota Beach'],
    icon: '🏛',
  },
  {
    id: '5',
    title: 'Maldives Luxury Lagoon',
    slug: 'maldives-resort-escape',
    destination: 'South Male & Ari Atolls',
    category: 'International',
    duration: '5 Days / 4 Nights',
    rating: 5.0,
    highlights: ['Overwater Villa', 'Speedboat Transfer', 'Reef Snorkeling'],
    icon: '🏝',
  },
];

export function HomeScreen({ navigation }: any) {
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

  const navigateToEnquiry = (packageName?: string) => {
    (navigation.getParent?.() || navigation).navigate('Enquiry', { packageName });
  };

  return (
    <View style={s.container}>
      <BrandHeader
        subtitle="Explore. Plan. Travel."
        onContactPress={() => navigation.navigate('Contact')}
      />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Airy Hero Banner */}
        <View style={s.heroCard}>
          <View style={s.heroBadge}>
            <Text style={s.heroBadgeText}>WHERE EVERY TRIP BECOMES A MEMORY</Text>
          </View>

          <Text style={s.heroTitle}>
            Your Journey Begins with{' '}
            <Text style={{ color: '#fed7aa' }}>SkyRay Holidays.</Text>
          </Text>

          <Text style={s.heroBody}>
            Discover handcrafted domestic tours, international getaways, and sacred pilgrimage journeys tailored to your preferences.
          </Text>

          <View style={s.heroActionRow}>
            <TouchableOpacity
              style={s.heroBtn}
              onPress={() => navigation.navigate('Packages')}
              activeOpacity={0.85}
            >
              <Text style={s.heroBtnText}>Explore Packages</Text>
              <Text style={s.heroBtnArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.heroSecondaryBtn}
              onPress={() => navigateToEnquiry('Custom Planning Request')}
              activeOpacity={0.85}
            >
              <Text style={s.heroSecondaryBtnText}>Custom Quote</Text>
            </TouchableOpacity>
          </View>

          {/* Clean Trust Pillars */}
          <View style={s.trustRow}>
            <Text style={s.trustItem}>✓ Curated Itineraries</Text>
            <Text style={s.trustItem}>✓ 24/7 Support</Text>
            <Text style={s.trustItem}>✓ Best Experience</Text>
          </View>
        </View>

        {/* Quick Category Navigation Pills */}
        <View style={s.categoryStrip}>
          <TouchableOpacity
            style={[s.categoryChip, s.categoryChipActive]}
            onPress={() => navigation.navigate('Packages')}
          >
            <Text style={s.categoryChipIcon}>🌍</Text>
            <Text style={[s.categoryChipText, s.categoryChipTextActive]}>All Tours</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.categoryChip}
            onPress={() => navigation.navigate('Packages')}
          >
            <Text style={s.categoryChipIcon}>🇮🇳</Text>
            <Text style={s.categoryChipText}>Within India</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.categoryChip}
            onPress={() => navigation.navigate('Packages')}
          >
            <Text style={s.categoryChipIcon}>✈</Text>
            <Text style={s.categoryChipText}>International</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.categoryChip}
            onPress={() => navigation.navigate('Hajj & Umrah')}
          >
            <Text style={s.categoryChipIcon}>☾</Text>
            <Text style={s.categoryChipText}>Pilgrimage</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Tours Section */}
        <View style={s.sectionHeader}>
          <View>
            <Text style={s.sectionEyebrow}>TOP DESTINATIONS</Text>
            <Text style={s.sectionTitle}>Featured Packages</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Packages')}
            style={s.viewAllBtn}
          >
            <Text style={s.viewAllText}>View all →</Text>
          </TouchableOpacity>
        </View>

        {/* Tour Cards */}
        {FEATURED_TOURS.map((item) => {
          const cardImg = getPackageImage(item.slug);
          return (
            <TouchableOpacity
              key={item.id}
              style={s.card}
              activeOpacity={0.92}
              onPress={() => navigateToPackage(item.slug)}
            >
              <View style={s.cardImageFrame}>
                <Image
                  source={cardImg}
                  style={s.cardCoverImg}
                  resizeMode="cover"
                />
                <View style={s.cardOverlay} />
                <View style={s.cardFloatingTop}>
                  <View
                    style={[
                      s.categoryTag,
                      item.category === 'Domestic' ? s.categoryTagSky : s.categoryTagNavy,
                    ]}
                  >
                    <Text style={s.categoryTagText}>
                      {item.category === 'Domestic' ? '🇮🇳 WITHIN INDIA' : '✈ INTERNATIONAL'}
                    </Text>
                  </View>
                  <View style={s.ratingBadge}>
                    <Text style={s.ratingStar}>★</Text>
                    <Text style={s.ratingScore}>{item.rating}</Text>
                  </View>
                </View>
                <View style={s.cardFloatingBottom}>
                  <View style={s.durationPill}>
                    <Text style={s.durationText}>⏱ {item.duration}</Text>
                  </View>
                </View>
              </View>

              <View style={s.cardInner}>
                <Text style={s.cardTitle}>{item.title}</Text>
                <Text style={s.cardDestination}>📍 {item.destination}</Text>

                {/* Inclusions Chips */}
                <View style={s.highlightsRow}>
                  {item.highlights.map((h, i) => (
                    <View key={i} style={s.highlightChip}>
                      <Text style={s.highlightText}>• {h}</Text>
                    </View>
                  ))}
                </View>

                {/* Bottom Strip: Price On Enquiry & Prominent View Details CTA */}
                <View style={s.cardBottom}>
                  <View>
                    <Text style={s.priceLabel}>Custom Quote</Text>
                    <Text style={s.priceValue}>Price on Enquiry</Text>
                  </View>

                  <TouchableOpacity
                    style={s.viewDetailsBtn}
                    onPress={() => navigateToPackage(item.slug)}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={`View details for ${item.title}`}
                  >
                    <Text style={s.viewDetailsText}>View Details</Text>
                    <Text style={s.viewDetailsArrow}>→</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Hajj & Umrah Dedicated Showcase Banner */}
        <TouchableOpacity
          style={s.pilgrimBanner}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Hajj & Umrah')}
        >
          <View style={s.pilgrimIconBox}>
            <Text style={s.pilgrimIcon}>☾</Text>
          </View>

          <View style={s.pilgrimContent}>
            <View style={s.pilgrimBadge}>
              <Text style={s.pilgrimBadgeText}>SACRED JOURNEYS</Text>
            </View>
            <Text style={s.pilgrimTitle}>Hajj &amp; Umrah Services</Text>
            <Text style={s.pilgrimBody}>
              5-Star hotels near Haram, dedicated scholars, and complete visa care.
            </Text>
            <Text style={s.pilgrimLink}>Explore Pilgrimage Packages →</Text>
          </View>
        </TouchableOpacity>

        {/* Google Reviews Trust Strip */}
        <TouchableOpacity
          style={s.reviewsStrip}
          onPress={() => navigation.navigate('Reviews')}
          activeOpacity={0.9}
        >
          <View style={s.reviewsScoreBox}>
            <Text style={s.reviewsBigScore}>4.8</Text>
            <Text style={s.reviewsStars}>★★★★★</Text>
          </View>
          <View style={s.reviewsContent}>
            <Text style={s.reviewsHeading}>Rated 4.8 / 5 on Google</Text>
            <Text style={s.reviewsSub}>Trusted by 1,200+ satisfied travelers worldwide</Text>
          </View>
          <Text style={s.reviewsArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: C.deep,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    shadowColor: C.deep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: '#93c5fd',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  heroBody: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    marginBottom: 18,
  },
  heroActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.gold,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  heroBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
    marginRight: 6,
  },
  heroBtnArrow: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
  },
  heroSecondaryBtn: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  heroSecondaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: 18,
    paddingTop: 14,
  },
  trustItem: {
    color: '#bae6fd',
    fontSize: 10.5,
    fontWeight: '700',
  },
  categoryStrip: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  categoryChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: '#e0f2fe',
    borderColor: '#7dd3fc',
  },
  categoryChipIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#0369a1',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: C.skyDark,
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: C.deep,
  },
  viewAllBtn: {
    paddingBottom: 2,
  },
  viewAllText: {
    color: C.skyDark,
    fontSize: 13,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImageFrame: {
    width: '100%',
    height: 175,
    backgroundColor: '#0f172a',
    position: 'relative',
    overflow: 'hidden',
  },
  cardCoverImg: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.22)',
  },
  cardFloatingTop: {
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
  cardFloatingBottom: {
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
  durationText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardInner: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f2942',
    lineHeight: 22,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  cardDestination: {
    fontSize: 12.5,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '600',
  },
  highlightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  highlightChip: {
    backgroundColor: '#f8fafc',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  highlightText: {
    fontSize: 11,
    color: '#475569',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 9.5,
    color: '#0284c7',
    fontWeight: '800',
    textTransform: 'uppercase',
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
  pilgrimBanner: {
    backgroundColor: '#0f2942',
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pilgrimIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  pilgrimIcon: {
    fontSize: 24,
    color: C.gold,
  },
  pilgrimContent: {
    flex: 1,
  },
  pilgrimBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  pilgrimBadgeText: {
    color: '#fde68a',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pilgrimTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  pilgrimBody: {
    color: '#cbd5e1',
    fontSize: 11.5,
    lineHeight: 16,
    marginVertical: 4,
  },
  pilgrimLink: {
    color: '#38bdf8',
    fontSize: 11.5,
    fontWeight: '800',
    marginTop: 2,
  },
  reviewsStrip: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewsScoreBox: {
    alignItems: 'center',
    marginRight: 14,
    paddingRight: 14,
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
  },
  reviewsBigScore: {
    fontSize: 22,
    fontWeight: '900',
    color: C.deep,
  },
  reviewsStars: {
    color: '#d97706',
    fontSize: 11,
    marginTop: 2,
  },
  reviewsContent: {
    flex: 1,
  },
  reviewsHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: C.deep,
  },
  reviewsSub: {
    fontSize: 11.5,
    color: C.muted,
    marginTop: 2,
  },
  reviewsArrow: {
    fontSize: 20,
    color: '#94a3b8',
    fontWeight: '700',
  },
});
