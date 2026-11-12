import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ImageBackground,
} from 'react-native';
import { BrandHeader } from '../components/UI';
import { Ionicons } from '@expo/vector-icons';

const GOOGLE_REVIEWS_URL = 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8';

const REAL_GOOGLE_REVIEWS = [
  {
    author: 'Riyaz Ahamed',
    rating: 5,
    text: 'Great service, quick response, knowledge in immigration services.',
    badge: 'Verified Google Review',
  },
  {
    author: 'Mohamed Thasin',
    rating: 5,
    text: 'Excellent customer services and Kind personal care to customers.',
    badge: 'Verified Google Review',
  },
  {
    author: 'Abdul Rasheed',
    rating: 5,
    text: 'He was very patient and guided me annd responded to all my queries.',
    badge: 'Verified Google Review',
  },
];

export function HomeScreen({ navigation }: any) {
  const navigateToEnquiry = (packageName?: string) => {
    (navigation.getParent?.() || navigation).navigate('Enquiry', { packageName });
  };

  const handleWhatsApp = () => {
    Linking.openURL(
      'https://wa.me/919176357791?text=Hello%20SkyRay%20Holidays!%20I%20would%20like%20to%20plan%20a%20trip.',
    ).catch(() => {});
  };

  const handleReviews = () => {
    Linking.openURL(GOOGLE_REVIEWS_URL).catch(() => {});
  };

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
        {/* 1. Hero Visual Banner with Photo Background */}
        <View style={s.heroCardWrapper}>
          <ImageBackground
            source={require('../../assets/hero.jpg')}
            style={s.heroBackground}
            imageStyle={s.heroBackgroundImage}
          >
            <View style={s.heroOverlay}>
              <View style={s.heroBadge}>
                <Ionicons name="sparkles" size={12} color="#38bdf8" style={{ marginRight: 6 }} />
                <Text style={s.heroBadgeText}>SKYRAY HOLIDAYS CONCIERGE</Text>
              </View>

              <Text style={s.heroTitle}>
                Where Every Trip Becomes a Sacred Memory
              </Text>

              <Text style={s.heroTagline}>
                Thoughtfully planned holidays, specialized world destinations, and sacred Hajj &amp; Umrah journeys.
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
                  <Text style={s.heroSecondaryBtnText}>Plan Custom Trip</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* 2. About SkyRay Holidays Section */}
        <View style={s.aboutCard}>
          <View style={s.aboutHeader}>
            <View style={s.aboutIconWrap}>
              <Ionicons name="compass-outline" size={20} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.aboutEyebrow}>ABOUT SKYRAY HOLIDAYS</Text>
              <Text style={s.aboutTitle}>Your Trusted Travel Partner</Text>
            </View>
          </View>

          <Text style={s.aboutParagraph}>
            Based in Kumbakonam, Tamil Nadu, SkyRay Holidays is a premier tour operator committed to making your travel seamless, spiritual, and unforgettable.
          </Text>

          <Text style={s.aboutParagraphSub}>
            From personalized luxury escapes to our specialized key destinations—including Reunion Island, Russia, Turkey, Mauritius, and the Maldives—to sacred, scholar-guided Hajj and Umrah pilgrimages, we manage every detail with complete transparency and dedicated care.
          </Text>

          {/* 3 Core Value Pillars */}
          <View style={s.aboutPillarsGrid}>
            <View style={s.aboutPillarItem}>
              <View style={[s.pillarDot, { backgroundColor: '#e0f2fe' }]}>
                <Ionicons name="shield-checkmark" size={16} color="#0284c7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.pillarTitle}>Transparent Pricing</Text>
                <Text style={s.pillarSub}>No hidden fees, complete itinerary clarity upfront.</Text>
              </View>
            </View>

            <View style={s.aboutPillarItem}>
              <View style={[s.pillarDot, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="moon" size={16} color="#d97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.pillarTitle}>Sacred Pilgrimages</Text>
                <Text style={s.pillarSub}>Verified Haram-proximity hotels &amp; scholar guides.</Text>
              </View>
            </View>

            <View style={s.aboutPillarItem}>
              <View style={[s.pillarDot, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="headset" size={16} color="#16a34a" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.pillarTitle}>24/7 Concierge Support</Text>
                <Text style={s.pillarSub}>Dedicated assistance before, during, and after travel.</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={s.aboutContactBtn}
            onPress={() => navigation.navigate('Contact')}
            activeOpacity={0.85}
          >
            <Text style={s.aboutContactBtnText}>Learn More About Our Team</Text>
            <Ionicons name="arrow-forward" size={14} color="#0284c7" />
          </TouchableOpacity>
        </View>

        {/* 3. Visual Experience Portals (Photo Cards with NO Cluttered Package Details) */}
        <View style={s.portalsSection}>
          <Text style={s.sectionEyebrow}>WHAT WE OFFER</Text>
          <Text style={s.sectionTitle}>Curated Travel Portals</Text>

          {/* Portal 1: Specialized Key Destinations */}
          <TouchableOpacity
            style={s.portalCard}
            onPress={() => navigation.navigate('Packages')}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={require('../../assets/destinations/maldives.jpg')}
              style={s.portalBg}
              imageStyle={s.portalBgImg}
            >
              <View style={s.portalOverlay}>
                <View style={s.portalTag}>
                  <Text style={s.portalTagText}>SPECIALIZED</Text>
                </View>
                <Text style={s.portalTitle}>Our Specialized Key Destinations</Text>
                <Text style={s.portalSubtitle}>
                  Reunion Island • Russia • Turkey • Mauritius • Maldives • Seychelles • Armenia • Georgia • Azerbaijan
                </Text>
                <View style={s.portalBtn}>
                  <Text style={s.portalBtnText}>View All Destinations</Text>
                  <Ionicons name="arrow-forward" size={13} color="#ffffff" />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* Portal 2: Hajj & Umrah Pilgrimages */}
          <TouchableOpacity
            style={s.portalCard}
            onPress={() => navigation.navigate('Hajj & Umrah')}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={require('../../assets/destinations/mecca.jpg')}
              style={s.portalBg}
              imageStyle={s.portalBgImg}
            >
              <View style={s.portalOverlay}>
                <View style={[s.portalTag, { backgroundColor: '#d97706' }]}>
                  <Text style={s.portalTagText}>SACRED BLESSINGS</Text>
                </View>
                <Text style={s.portalTitle}>Hajj &amp; Umrah Pilgrimages</Text>
                <Text style={s.portalSubtitle}>
                  Economy and 5-Star luxury packages in Makkah &amp; Madinah with walking proximity to the Holy Harams.
                </Text>
                <View style={s.portalBtn}>
                  <Text style={s.portalBtnText}>View Pilgrimage Packages</Text>
                  <Ionicons name="arrow-forward" size={13} color="#ffffff" />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* Portal 3: Bespoke Custom Trips */}
          <TouchableOpacity
            style={s.portalCard}
            onPress={() => navigateToEnquiry('Tailor-Made Tour')}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={require('../../assets/destinations/dubai.jpg')}
              style={s.portalBg}
              imageStyle={s.portalBgImg}
            >
              <View style={s.portalOverlay}>
                <View style={[s.portalTag, { backgroundColor: '#0284c7' }]}>
                  <Text style={s.portalTagText}>CUSTOM PLANNING</Text>
                </View>
                <Text style={s.portalTitle}>Tailored World Journeys</Text>
                <Text style={s.portalSubtitle}>
                  Plan custom family vacations, honeymoon getaways, or group tours across 197 countries.
                </Text>
                <View style={s.portalBtn}>
                  <Text style={s.portalBtnText}>Start Free Enquiry</Text>
                  <Ionicons name="arrow-forward" size={13} color="#ffffff" />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* 4. Real Google Reviews Section (Authentic Customer Feedback) */}
        <View style={s.reviewsSection}>
          <View style={s.reviewsSectionHead}>
            <View>
              <Text style={s.sectionEyebrow}>CUSTOMER EXPERIENCES</Text>
              <Text style={s.sectionTitle}>Real Reviews on Google</Text>
            </View>
            <View style={s.googleRatingPill}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={s.googleRatingPillText}>4.9 / 5.0</Text>
            </View>
          </View>

          {/* Google Business Overview Banner */}
          <TouchableOpacity
            style={s.googleOverviewCard}
            onPress={handleReviews}
            activeOpacity={0.88}
          >
            <View style={s.googleGWrap}>
              <Text style={s.googleGText}>G</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.googleOverviewTitle}>Skyray Holidays</Text>
              <Text style={s.googleOverviewSub}>
                34 Reviews on Google Maps • Melacavery, Kumbakonam
              </Text>
            </View>
            <View style={s.googleBadge}>
              <Ionicons name="checkmark-circle" size={13} color="#10b981" style={{ marginRight: 4 }} />
              <Text style={s.googleBadgeText}>Verified</Text>
            </View>
          </TouchableOpacity>

          {/* 3 Real Review Cards */}
          <View style={s.realReviewsList}>
            {REAL_GOOGLE_REVIEWS.map((rev, index) => (
              <View key={index} style={s.realReviewCard}>
                <View style={s.reviewCardTop}>
                  <View style={s.authorAvatar}>
                    <Text style={s.authorAvatarText}>{rev.author.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.reviewAuthorName}>{rev.author}</Text>
                    <Text style={s.reviewBadgeText}>{rev.badge}</Text>
                  </View>
                  <View style={s.reviewStarsRow}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Ionicons key={i} name="star" size={13} color="#f59e0b" />
                    ))}
                  </View>
                </View>

                <Text style={s.reviewText}>&ldquo;{rev.text}&rdquo;</Text>
              </View>
            ))}
          </View>

          {/* Open Google Maps Button */}
          <TouchableOpacity
            style={s.openMapsBtn}
            onPress={handleReviews}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-google" size={16} color="#0284c7" style={{ marginRight: 8 }} />
            <Text style={s.openMapsBtnText}>Read All 34 Reviews on Google Maps</Text>
            <Ionicons name="open-outline" size={14} color="#0284c7" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* 5. Office & Quick Contact Card */}
        <View style={s.officeCard}>
          <Text style={s.officeTitle}>SkyRay Holidays Office</Text>
          <View style={s.officeRow}>
            <Ionicons name="location-outline" size={16} color="#0284c7" style={{ marginTop: 2, marginRight: 8 }} />
            <Text style={s.officeText}>
              No. 3, Rahamath Complex, 5th Cross Road, ESMP Nagar, Melacavery, Kumbakonam, Tamil Nadu 612002
            </Text>
          </View>
          <View style={s.officeRow}>
            <Ionicons name="time-outline" size={16} color="#0284c7" style={{ marginRight: 8 }} />
            <Text style={s.officeText}>
              Mon – Sat: 9:30 AM – 8:30 PM (24/7 Phone &amp; WhatsApp Concierge)
            </Text>
          </View>
        </View>

        {/* 6. Instant Action Buttons */}
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
    paddingBottom: 40,
  },

  // 1. Hero Card
  heroCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#0f2942',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  heroBackground: {
    width: '100%',
    minHeight: 280,
  },
  heroBackgroundImage: {
    borderRadius: 20,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 41, 66, 0.88)',
    padding: 22,
    justifyContent: 'center',
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
    color: '#38bdf8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  heroTitle: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  heroTagline: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 20,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
  },
  heroPrimaryBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  heroSecondaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },

  // 2. About Card
  aboutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  aboutIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutEyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#0284c7',
    marginBottom: 2,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f2942',
    letterSpacing: -0.3,
  },
  aboutParagraph: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 10,
  },
  aboutParagraphSub: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748b',
    marginBottom: 16,
  },
  aboutPillarsGrid: {
    gap: 10,
    marginBottom: 18,
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  aboutPillarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pillarDot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f2942',
  },
  pillarSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  aboutContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bae6fd',
    gap: 6,
  },
  aboutContactBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0284c7',
  },

  // 3. Portals Section
  portalsSection: {
    marginBottom: 24,
  },
  sectionEyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#0284c7',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f2942',
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  portalCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  portalBg: {
    width: '100%',
    minHeight: 175,
  },
  portalBgImg: {
    borderRadius: 16,
  },
  portalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    padding: 16,
    justifyContent: 'space-between',
  },
  portalTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#0284c7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  portalTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  portalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginTop: 8,
  },
  portalSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#cbd5e1',
    marginTop: 4,
    marginBottom: 12,
  },
  portalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  portalBtnText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '800',
  },

  // 4. Real Google Reviews Section
  reviewsSection: {
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
  reviewsSectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  googleRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fef3c7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  googleRatingPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#b45309',
  },
  googleOverviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  googleGWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  googleGText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4285f4',
  },
  googleOverviewTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f2942',
  },
  googleOverviewSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  googleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  googleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  realReviewsList: {
    gap: 10,
    marginBottom: 16,
  },
  realReviewCard: {
    backgroundColor: '#f8fbfe',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reviewCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  reviewAuthorName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f2942',
  },
  reviewBadgeText: {
    fontSize: 9.5,
    color: '#64748b',
  },
  reviewStarsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#334155',
    fontStyle: 'italic',
  },
  openMapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  openMapsBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0284c7',
  },

  // 5. Office Card
  officeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  officeTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f2942',
    marginBottom: 10,
  },
  officeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  officeText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#64748b',
    flex: 1,
  },

  // 6. Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  waActionBtn: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  waActionText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  enquiryActionBtn: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0284c7',
  },
  enquiryActionText: {
    color: '#0284c7',
    fontWeight: '800',
    fontSize: 13,
  },
});
