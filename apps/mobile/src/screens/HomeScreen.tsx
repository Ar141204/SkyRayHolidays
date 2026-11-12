import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Linking,
} from 'react-native';
import { BrandHeader, C } from '../components/UI';
import { getPackageImage } from '../lib/api';
import { Ionicons } from '@expo/vector-icons';

export function HomeScreen({ navigation }: any) {
  const navigateToEnquiry = (packageName?: string) => {
    (navigation.getParent?.() || navigation).navigate('Enquiry', { packageName });
  };

  const handleWhatsApp = () => {
    Linking.openURL(
      'https://wa.me/919876543210?text=Hello%20SkyRay%20Holidays!%20I%20would%20like%20to%20plan%20a%20trip.',
    ).catch(() => {});
  };

  const kashmirImg = getPackageImage('kashmir-paradise');
  const maldivesImg = getPackageImage('maldives-resort-escape');
  const meccaImg = getPackageImage('premium-hajj-package');

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
        {/* 1. Welcome Brand Hero */}
        <View style={s.heroCard}>
          <View style={s.heroBadge}>
            <Ionicons name="sparkles" size={12} color="#93c5fd" style={{ marginRight: 5 }} />
            <Text style={s.heroBadgeText}>YOUR TRUSTED TRAVEL CONCIERGE</Text>
          </View>

          <Text style={s.heroTitle}>
            Where Every Trip Becomes a{' '}
            <Text style={{ color: '#fed7aa' }}>Cherished Memory.</Text>
          </Text>

          <Text style={s.heroBody}>
            Bespoke domestic tours, handpicked international holidays, and sacred pilgrimage journeys crafted with authentic care and 24/7 personal support.
          </Text>

          <View style={s.heroActionRow}>
            <TouchableOpacity
              style={s.heroBtn}
              onPress={() => navigation.navigate('Packages')}
              activeOpacity={0.85}
            >
              <Text style={s.heroBtnText}>Explore All Packages</Text>
              <Ionicons name="arrow-forward" size={14} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={s.heroSecondaryBtn}
              onPress={() => navigateToEnquiry('Custom Planning Request')}
              activeOpacity={0.85}
            >
              <Text style={s.heroSecondaryBtnText}>Request Custom Quote</Text>
            </TouchableOpacity>
          </View>

          {/* Clean Trust Pillars with Vector Icons */}
          <View style={s.trustRow}>
            <View style={s.trustItemWrap}>
              <Ionicons name="checkmark-circle" size={13} color="#38bdf8" />
              <Text style={s.trustItem}>Curated Itineraries</Text>
            </View>
            <View style={s.trustItemWrap}>
              <Ionicons name="checkmark-circle" size={13} color="#38bdf8" />
              <Text style={s.trustItem}>24/7 Expert Concierge</Text>
            </View>
            <View style={s.trustItemWrap}>
              <Ionicons name="checkmark-circle" size={13} color="#38bdf8" />
              <Text style={s.trustItem}>Transparent Inclusions</Text>
            </View>
          </View>
        </View>

        {/* 2. About SkyRay Holidays: Brand Story */}
        <View style={s.aboutCard}>
          <View style={s.sectionKickerWrap}>
            <Ionicons name="business-outline" size={13} color="#0284c7" style={{ marginRight: 5 }} />
            <Text style={s.sectionKicker}>ABOUT SKYRAY HOLIDAYS</Text>
          </View>

          <Text style={s.aboutHeadline}>
            Connecting You to Meaningful Places &amp; Sacred Moments
          </Text>

          <Text style={s.aboutParagraph}>
            At SkyRay Holidays, we believe travel is more than reaching a destination — it is an enriching experience that connects you with new cultures, creates cherished family memories, and offers spiritual renewal.
          </Text>

          <Text style={s.aboutParagraph}>
            Whether discovering Kashmir&apos;s breathtaking valleys, relaxing in overwater villas in the Maldives, or embarking on sacred Hajj &amp; Umrah pilgrimages in Makkah and Madinah, our team is committed to personal care, transparent pricing, and seamless ground logistics.
          </Text>

          {/* 4 Brand Metrics */}
          <View style={s.metricsGrid}>
            <View style={s.metricItem}>
              <Text style={s.metricNumber}>10,000+</Text>
              <Text style={s.metricLabel}>Happy Travelers</Text>
            </View>
            <View style={s.metricItem}>
              <Text style={s.metricNumber}>50+</Text>
              <Text style={s.metricLabel}>Global Destinations</Text>
            </View>
            <View style={s.metricItem}>
              <Text style={s.metricNumber}>12+ Years</Text>
              <Text style={s.metricLabel}>Industry Expertise</Text>
            </View>
            <View style={s.metricItem}>
              <Text style={s.metricNumber}>99.4%</Text>
              <Text style={s.metricLabel}>Satisfaction Rate</Text>
            </View>
          </View>
        </View>

        {/* 3. Core Values & Pillars */}
        <View style={s.valuesSection}>
          <View style={s.sectionHeader}>
            <View>
              <Text style={s.sectionKicker}>CORE VALUES</Text>
              <Text style={s.sectionTitle}>What Guides Everything We Do</Text>
            </View>
          </View>

          <View style={s.pillarCard}>
            <View style={s.pillarIconWrap}>
              <Ionicons name="compass-outline" size={22} color="#0ea5e9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.pillarTitle}>Our Mission</Text>
              <Text style={s.pillarText}>
                To make travel accessible, enriching, and effortless for every traveler through thoughtful planning, transparent pricing, and personalized itineraries.
              </Text>
            </View>
          </View>

          <View style={[s.pillarCard, s.pillarCardHighlight]}>
            <View style={[s.pillarIconWrap, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="sparkles-outline" size={22} color="#d97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.pillarTitle}>Our Vision</Text>
              <Text style={s.pillarText}>
                To be the most trusted global travel and pilgrimage facilitator, celebrated for unwavering reliability, customer warmth, and spiritual integrity.
              </Text>
            </View>
          </View>

          <View style={s.pillarCard}>
            <View style={[s.pillarIconWrap, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#10b981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.pillarTitle}>Why Choose Us</Text>
              <Text style={s.pillarText}>
                Handpicked 4-star and 5-star hotels, verified private chauffeurs, licensed tour guides, transparent quotes, and dedicated 24/7 concierge assistance.
              </Text>
            </View>
          </View>
        </View>

        {/* 4. How We Plan Your Trip (3 Step Process) */}
        <View style={s.processSection}>
          <View style={s.sectionHeader}>
            <View>
              <Text style={s.sectionKicker}>SEAMLESS TRIP PLANNING</Text>
              <Text style={s.sectionTitle}>How We Plan Your Perfect Trip</Text>
            </View>
          </View>

          <View style={s.stepRow}>
            <View style={s.stepBadge}>
              <Text style={s.stepBadgeText}>1</Text>
            </View>
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>Share Your Dream Journey</Text>
              <Text style={s.stepBody}>
                Tell us your preferred travel dates, group size, and destination wish list through our quick enquiry form or directly on WhatsApp.
              </Text>
            </View>
          </View>

          <View style={s.stepRow}>
            <View style={s.stepBadge}>
              <Text style={s.stepBadgeText}>2</Text>
            </View>
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>Receive a Tailored Itinerary</Text>
              <Text style={s.stepBody}>
                Our destination specialists prepare a day-by-day itinerary tailored to your pace, budget, and accommodation tier with upfront pricing.
              </Text>
            </View>
          </View>

          <View style={[s.stepRow, { borderLeftWidth: 0, paddingBottom: 0 }]}>
            <View style={[s.stepBadge, { backgroundColor: '#10b981' }]}>
              <Text style={s.stepBadgeText}>3</Text>
            </View>
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>Travel with Complete Peace of Mind</Text>
              <Text style={s.stepBody}>
                Enjoy private VIP airport transfers, verified hotels, on-ground sightseeing, and 24/7 dedicated support throughout your entire stay.
              </Text>
            </View>
          </View>
        </View>

        {/* 5. Explore Our Gateways (Links to Dedicated Tabs) */}
        <View style={s.gatewaysSection}>
          <View style={s.sectionHeader}>
            <View>
              <Text style={s.sectionKicker}>EXPLORE COLLECTIONS</Text>
              <Text style={s.sectionTitle}>Where Would You Like to Go?</Text>
            </View>
          </View>

          {/* Gateway 1: Domestic Packages */}
          <TouchableOpacity
            style={s.gatewayCard}
            onPress={() => navigation.navigate('Packages')}
            activeOpacity={0.92}
          >
            <View style={s.gatewayImageFrame}>
              <Image source={kashmirImg} style={s.gatewayImage} resizeMode="cover" />
              <View style={s.gatewayOverlay} />
              <View style={s.gatewayTag}>
                <Ionicons name="map" size={11} color="#ffffff" style={{ marginRight: 4 }} />
                <Text style={s.gatewayTagText}>WITHIN INDIA</Text>
              </View>
            </View>
            <View style={s.gatewayBody}>
              <Text style={s.gatewayTitle}>Domestic Holidays &amp; Getaways</Text>
              <Text style={s.gatewaySubtitle}>
                Kashmir paradise, Kerala backwaters, Golden Triangle heritage, Andaman islands &amp; Goa.
              </Text>
              <View style={s.gatewayLinkRow}>
                <Text style={s.gatewayLink}>Browse 5 Domestic Tours</Text>
                <Ionicons name="arrow-forward" size={14} color="#0284c7" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Gateway 2: International Packages */}
          <TouchableOpacity
            style={s.gatewayCard}
            onPress={() => navigation.navigate('Packages')}
            activeOpacity={0.92}
          >
            <View style={s.gatewayImageFrame}>
              <Image source={maldivesImg} style={s.gatewayImage} resizeMode="cover" />
              <View style={s.gatewayOverlay} />
              <View style={[s.gatewayTag, { backgroundColor: 'rgba(15, 23, 42, 0.88)' }]}>
                <Ionicons name="airplane" size={11} color="#ffffff" style={{ marginRight: 4 }} />
                <Text style={s.gatewayTagText}>INTERNATIONAL</Text>
              </View>
            </View>
            <View style={s.gatewayBody}>
              <Text style={s.gatewayTitle}>International Escapes</Text>
              <Text style={s.gatewaySubtitle}>
                Dubai, Sri Lanka wonder island, Maldives luxury lagoons, Bali, Turkey &amp; Europe.
              </Text>
              <View style={s.gatewayLinkRow}>
                <Text style={s.gatewayLink}>Browse 7 International Holidays</Text>
                <Ionicons name="arrow-forward" size={14} color="#0284c7" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Gateway 3: Sacred Pilgrimage */}
          <TouchableOpacity
            style={s.gatewayCard}
            onPress={() => navigation.navigate('Hajj & Umrah')}
            activeOpacity={0.92}
          >
            <View style={s.gatewayImageFrame}>
              <Image source={meccaImg} style={s.gatewayImage} resizeMode="cover" />
              <View style={s.gatewayOverlay} />
              <View style={[s.gatewayTag, { backgroundColor: 'rgba(217, 119, 6, 0.94)' }]}>
                <Ionicons name="moon" size={11} color="#ffffff" style={{ marginRight: 4 }} />
                <Text style={s.gatewayTagText}>SACRED BLESSINGS</Text>
              </View>
            </View>
            <View style={s.gatewayBody}>
              <Text style={s.gatewayTitle}>Hajj &amp; Umrah Pilgrimage</Text>
              <Text style={s.gatewaySubtitle}>
                5-Star hotels directly facing Haram, VIP transport, dedicated Islamic scholars &amp; visa care.
              </Text>
              <View style={s.gatewayLinkRow}>
                <Text style={[s.gatewayLink, { color: '#d97706' }]}>Explore Pilgrimage Packages</Text>
                <Ionicons name="arrow-forward" size={14} color="#d97706" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 6. Ready to Plan Custom Trip CTA Card */}
        <View style={s.ctaCard}>
          <Text style={s.ctaKicker}>READY TO EXPLORE?</Text>
          <Text style={s.ctaTitle}>Let&apos;s Plan Your Next Adventure Together</Text>
          <Text style={s.ctaBody}>
            Speak directly with our destination designers to customize travel dates, flight itineraries, and hotel room categories.
          </Text>

          <View style={s.ctaActionRow}>
            <TouchableOpacity
              style={s.ctaPrimaryBtn}
              onPress={() => navigateToEnquiry('Custom Holiday Request')}
              activeOpacity={0.85}
            >
              <Text style={s.ctaPrimaryBtnText}>Start Trip Enquiry</Text>
              <Ionicons name="arrow-forward" size={14} color="#ffffff" style={{ marginLeft: 5 }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={s.ctaWaBtn}
              onPress={handleWhatsApp}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={s.ctaWaBtnText}>Chat on WhatsApp</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: C.deep,
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    shadowColor: C.deep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
    lineHeight: 31,
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
    flexWrap: 'wrap',
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.gold,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  heroBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
    marginRight: 6,
  },
  heroSecondaryBtn: {
    paddingVertical: 12,
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
    flexWrap: 'wrap',
    gap: 8,
  },
  trustItemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustItem: {
    color: '#bae6fd',
    fontSize: 10.5,
    fontWeight: '700',
  },
  aboutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionKickerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionKicker: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: C.skyDark,
  },
  aboutHeadline: {
    fontSize: 19,
    fontWeight: '900',
    color: C.deep,
    lineHeight: 25,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  aboutParagraph: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
    marginBottom: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 14,
  },
  metricItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: C.deep,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  valuesSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: C.deep,
    letterSpacing: -0.3,
  },
  pillarCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pillarCardHighlight: {
    borderColor: '#bae6fd',
    backgroundColor: '#fbfdff',
  },
  pillarIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eaf7fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  pillarTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.deep,
    marginBottom: 4,
  },
  pillarText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
  },
  processSection: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  stepRow: {
    flexDirection: 'row',
    borderLeftWidth: 2,
    borderLeftColor: '#e0f2fe',
    paddingLeft: 16,
    marginLeft: 12,
    paddingBottom: 20,
    position: 'relative',
  },
  stepBadge: {
    position: 'absolute',
    left: -24,
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: C.deep,
    marginBottom: 3,
  },
  stepBody: {
    fontSize: 12.5,
    color: '#64748b',
    lineHeight: 18,
  },
  gatewaysSection: {
    marginBottom: 20,
  },
  gatewayCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  gatewayImageFrame: {
    width: '100%',
    height: 150,
    position: 'relative',
    backgroundColor: '#0f172a',
  },
  gatewayImage: {
    width: '100%',
    height: '100%',
  },
  gatewayOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
  },
  gatewayTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 132, 199, 0.92)',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 6,
  },
  gatewayTagText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  gatewayBody: {
    padding: 16,
  },
  gatewayTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: C.deep,
    marginBottom: 4,
  },
  gatewaySubtitle: {
    fontSize: 12.5,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 10,
  },
  gatewayLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  gatewayLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284c7',
  },
  ctaCard: {
    backgroundColor: '#0f2942',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#0f2942',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
  },
  ctaKicker: {
    fontSize: 10,
    fontWeight: '800',
    color: '#f59e0b',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  ctaTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  ctaBody: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#cbd5e1',
    marginBottom: 18,
  },
  ctaActionRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  ctaPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  ctaPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  ctaWaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  ctaWaBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
