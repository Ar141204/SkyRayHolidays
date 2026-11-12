import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { BrandHeader, C } from '../components/UI';
import { getPackageImage, SPECIALIZED_DESTINATIONS } from '../lib/api';
import { Ionicons } from '@expo/vector-icons';

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/Skyray+Holidays/@10.9734181,79.365918,17z/data=!3m1!4b1!4m6!3m5!1s0x3baacd18aac8de19:0xfb5f36c0944a08a8!8m2!3d10.9734181!4d79.3684929!16s%2Fg%2F11y8hlpcs0?entry=ttu&g_ep=EgoyMDI2MTEwOS4wIKXMDSoASAFQAw%3D%3D';

export function HomeScreen({ navigation }: any) {
  const navigateToEnquiry = (packageName?: string) => {
    (navigation.getParent?.() || navigation).navigate('Enquiry', { packageName });
  };

  const navigateToPackage = (slug: string) => {
    try {
      navigation.navigate('PackageDetail', { slug });
    } catch {
      navigation.getParent?.()?.navigate('PackageDetail', { slug });
    }
  };

  const handleWhatsApp = () => {
    Linking.openURL(
      'https://wa.me/919176357791?text=Hello%20SkyRay%20Holidays!%20I%20would%20like%20to%20plan%20a%20trip.',
    ).catch(() => {});
  };

  const handleReviews = () => {
    Linking.openURL(GOOGLE_REVIEWS_URL).catch(() => {});
  };

  const meccaImg = getPackageImage('premium-hajj-package');

  return (
    <View style={s.container}>
      <BrandHeader
        subtitle="Explore · Plan · Travel"
        onContactPress={() => navigation.navigate('Contact')}
      />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Hero Card: Clean, Crisp & Modern */}
        <View style={s.heroCard}>
          <View style={s.heroBadge}>
            <Ionicons name="sparkles" size={12} color="#38bdf8" style={{ marginRight: 6 }} />
            <Text style={s.heroBadgeText}>PREMIUM TRAVEL CONCIERGE</Text>
          </View>

          <Text style={s.heroTitle}>
            Where Every Journey Becomes a Memory.
          </Text>

          <Text style={s.heroTagline}>
            Curated world holidays, specialized key destinations, and sacred Hajj &amp; Umrah journeys.
          </Text>

          <View style={s.heroActions}>
            <TouchableOpacity
              style={s.heroPrimaryBtn}
              onPress={() => navigation.navigate('Packages')}
              activeOpacity={0.85}
            >
              <Text style={s.heroPrimaryBtnText}>Explore Packages</Text>
              <Ionicons name="arrow-forward" size={14} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={s.heroSecondaryBtn}
              onPress={() => navigateToEnquiry('Custom Holiday Planning')}
              activeOpacity={0.85}
            >
              <Text style={s.heroSecondaryBtnText}>Custom Enquiry</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Quick Category Navigator (4 Clean Touchpoints) */}
        <View style={s.quickNavGrid}>
          <TouchableOpacity
            style={s.quickNavItem}
            onPress={() => navigation.navigate('Packages')}
            activeOpacity={0.85}
          >
            <View style={[s.quickNavIcon, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="star" size={18} color="#0284c7" />
            </View>
            <Text style={s.quickNavLabel}>Specialized</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.quickNavItem}
            onPress={() => navigation.navigate('Packages')}
            activeOpacity={0.85}
          >
            <View style={[s.quickNavIcon, { backgroundColor: '#f0fdf4' }]}>
              <Ionicons name="airplane" size={18} color="#16a34a" />
            </View>
            <Text style={s.quickNavLabel}>International</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.quickNavItem}
            onPress={() => navigation.navigate('Packages')}
            activeOpacity={0.85}
          >
            <View style={[s.quickNavIcon, { backgroundColor: '#fff7ed' }]}>
              <Ionicons name="map" size={18} color="#ea580c" />
            </View>
            <Text style={s.quickNavLabel}>Within India</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.quickNavItem}
            onPress={() => navigation.navigate('Hajj & Umrah')}
            activeOpacity={0.85}
          >
            <View style={[s.quickNavIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="moon" size={18} color="#d97706" />
            </View>
            <Text style={s.quickNavLabel}>Hajj &amp; Umrah</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Our Specialized Key Destinations Showcase */}
        <View style={s.sectionWrap}>
          <View style={s.sectionHeader}>
            <View>
              <Text style={s.sectionEyebrow}>HANDPICKED EXPERIENCES</Text>
              <Text style={s.sectionTitle}>Our Specialized Destinations</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Packages')}>
              <Text style={s.seeAllText}>View All →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.destinationsScroll}
          >
            {SPECIALIZED_DESTINATIONS.map((dest) => {
              const cardImg = getPackageImage(dest.image);
              return (
                <TouchableOpacity
                  key={dest.slug}
                  style={s.destCard}
                  onPress={() => navigateToPackage(dest.slug)}
                  activeOpacity={0.9}
                >
                  <View style={s.destImageWrap}>
                    <Image source={cardImg} style={s.destImage} resizeMode="cover" />
                    <View style={s.destImageOverlay} />
                    <View style={s.destDurationBadge}>
                      <Text style={s.destDurationText}>{dest.duration}</Text>
                    </View>
                  </View>
                  <View style={s.destBody}>
                    <Text style={s.destName} numberOfLines={1}>{dest.name}</Text>
                    <View style={s.destLinkRow}>
                      <Text style={s.destLinkText}>Explore Itinerary</Text>
                      <Ionicons name="arrow-forward" size={12} color="#0284c7" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. Sacred Hajj & Umrah Pilgrimage Spotlight */}
        <View style={s.pilgrimSpotlight}>
          <View style={s.pilgrimBadge}>
            <Ionicons name="moon" size={12} color="#fde68a" style={{ marginRight: 5 }} />
            <Text style={s.pilgrimBadgeText}>HAJJ &amp; UMRAH SERVICES</Text>
          </View>

          <Text style={s.pilgrimTitle}>Spiritual Peace with Full Comfort</Text>
          <Text style={s.pilgrimSubtitle}>
            Economy and 5-Star Premium packages with direct Haram proximity, VIP transfers &amp; scholar guidance.
          </Text>

          <View style={s.pilgrimTiersRow}>
            <View style={s.tierPill}>
              <Ionicons name="checkmark-circle" size={13} color="#10b981" />
              <Text style={s.tierPillText}>Economy Tier</Text>
            </View>
            <View style={s.tierPill}>
              <Ionicons name="sparkles" size={13} color="#f59e0b" />
              <Text style={s.tierPillText}>Premium 5-Star Tier</Text>
            </View>
          </View>

          <TouchableOpacity
            style={s.pilgrimBtn}
            onPress={() => navigation.navigate('Hajj & Umrah')}
            activeOpacity={0.85}
          >
            <Text style={s.pilgrimBtnText}>View Pilgrimage Packages</Text>
            <Ionicons name="arrow-forward" size={14} color="#0f2942" />
          </TouchableOpacity>
        </View>

        {/* 5. Google Reviews & Trust Card */}
        <TouchableOpacity
          style={s.reviewsCard}
          onPress={handleReviews}
          activeOpacity={0.85}
        >
          <View style={s.reviewsHeader}>
            <View style={s.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Ionicons key={i} name="star" size={16} color="#f59e0b" />
              ))}
            </View>
            <View style={s.googleBadge}>
              <Text style={s.googleBadgeText}>Google Verified</Text>
            </View>
          </View>

          <Text style={s.reviewsTitle}>5.0 Star Rated Travel Agency</Text>
          <Text style={s.reviewsBody}>
            Loved by travelers for transparent pricing, seamless logistics, and 24/7 personalized care.
          </Text>

          <View style={s.reviewsLinkRow}>
            <Text style={s.reviewsLinkText}>Read Customer Reviews on Google Maps</Text>
            <Ionicons name="open-outline" size={14} color="#0284c7" />
          </View>
        </TouchableOpacity>

        {/* 6. Why SkyRay (3 Minimalist Trust Pills - No Walls of Text) */}
        <View style={s.trustPillRow}>
          <View style={s.miniTrustPill}>
            <Ionicons name="bed-outline" size={15} color="#0284c7" />
            <Text style={s.miniTrustText}>Verified 4★ &amp; 5★ Stays</Text>
          </View>
          <View style={s.miniTrustPill}>
            <Ionicons name="shield-checkmark-outline" size={15} color="#10b981" />
            <Text style={s.miniTrustText}>Upfront Pricing</Text>
          </View>
          <View style={s.miniTrustPill}>
            <Ionicons name="headset-outline" size={15} color="#d97706" />
            <Text style={s.miniTrustText}>24/7 Concierge</Text>
          </View>
        </View>

        {/* 7. Bottom Instant Action Row */}
        <View style={s.bottomActions}>
          <TouchableOpacity
            style={s.waActionBtn}
            onPress={handleWhatsApp}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-whatsapp" size={17} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={s.waActionText}>Chat on WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.enquiryActionBtn}
            onPress={() => navigateToEnquiry('General Enquiry')}
            activeOpacity={0.85}
          >
            <Ionicons name="mail-outline" size={16} color="#0284c7" style={{ marginRight: 6 }} />
            <Text style={s.enquiryActionText}>Send Enquiry</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: '#0f2942',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0f2942',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 4,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#38bdf8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  heroTagline: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 18,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
  },
  heroPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  heroPrimaryBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  heroSecondaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroSecondaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  quickNavGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  quickNavItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  quickNavIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickNavLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#334155',
  },
  sectionWrap: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionEyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: '#0284c7',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f2942',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0284c7',
  },
  destinationsScroll: {
    paddingRight: 16,
    gap: 12,
  },
  destCard: {
    width: 175,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  destImageWrap: {
    width: '100%',
    height: 110,
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  destImage: {
    width: '100%',
    height: '100%',
  },
  destImageOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
  },
  destDurationBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  destDurationText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '700',
  },
  destBody: {
    padding: 10,
  },
  destName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f2942',
    marginBottom: 4,
  },
  destLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  destLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284c7',
  },
  pilgrimSpotlight: {
    backgroundColor: '#172554',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e3a8a',
  },
  pilgrimBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 14,
    marginBottom: 8,
  },
  pilgrimBadgeText: {
    color: '#fde68a',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pilgrimTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
  },
  pilgrimSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#93c5fd',
    marginBottom: 14,
  },
  pilgrimTiersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 20,
  },
  tierPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  pilgrimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
  },
  pilgrimBtnText: {
    color: '#0f2942',
    fontSize: 12.5,
    fontWeight: '800',
  },
  reviewsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  googleBadge: {
    backgroundColor: '#f0fdf4',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  googleBadgeText: {
    color: '#16a34a',
    fontSize: 10,
    fontWeight: '800',
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f2942',
    marginBottom: 4,
  },
  reviewsBody: {
    fontSize: 12.5,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 10,
  },
  reviewsLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewsLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284c7',
  },
  trustPillRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  miniTrustPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 5,
  },
  miniTrustText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 10,
  },
  waActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 13,
    borderRadius: 12,
  },
  waActionText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  enquiryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#0284c7',
    paddingVertical: 13,
    borderRadius: 12,
  },
  enquiryActionText: {
    color: '#0284c7',
    fontWeight: '800',
    fontSize: 13,
  },
});
