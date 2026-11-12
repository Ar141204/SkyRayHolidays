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
  Dimensions,
} from 'react-native';
import { BrandHeader } from '../components/UI';
import { Ionicons } from '@expo/vector-icons';
import { DESTINATION_IMAGES, SPECIALIZED_DESTINATIONS } from '../lib/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

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

const VISA_SERVICES = [
  {
    id: 'us',
    title: 'US Visa',
    category: 'B1 / B2 Tourist & Business',
    imageKey: 'us-visa',
    desc: 'DS-160, slot tracking & interview prep',
    country: 'United States',
  },
  {
    id: 'uk',
    title: 'UK Visa',
    category: 'Standard Visitor (6M - 10Y)',
    imageKey: 'uk-visa',
    desc: 'Document verification & biometrics',
    country: 'United Kingdom',
  },
  {
    id: 'schengen',
    title: 'Schengen Visa',
    category: 'All 29 Member Nations',
    imageKey: 'schengen-visa',
    desc: 'France, Germany, Switzerland & more',
    country: 'France',
  },
  {
    id: 'evisa',
    title: 'Global E-Visas',
    category: '50+ Fast-Track Countries',
    imageKey: 'dubai-holiday',
    desc: 'UAE, Saudi, Malaysia, Singapore',
    country: 'United Arab Emirates',
  },
];

export function HomeScreen({ navigation }: any) {
  const navigateToEnquiry = (params?: { packageName?: string; service?: string; country?: string }) => {
    (navigation.getParent?.() || navigation).navigate('Enquiry', params || {});
  };

  const handleWhatsApp = () => {
    Linking.openURL(
      'https://wa.me/919176357791?text=Hello%20SkyRay%20Holidays!%20I%20would%20like%20to%20plan%20a%20trip.',
    ).catch(() => {});
  };

  const handleCall = () => {
    Linking.openURL('tel:+919176357791').catch(() => {});
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
                <Text style={s.heroBadgeText}>WHERE EVERY TRIP BECOMES A MEMORY</Text>
              </View>

              <Text style={s.heroTitle}>
                Your Journey Begins{'\n'}
                <Text style={s.heroTitleAccent}>with SkyRay Holidays</Text>
              </Text>

              <Text style={s.heroTagline}>
                Thoughtfully planned holidays, specialized world destinations, and sacred pilgrimage journeys.
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
                  onPress={() => navigateToEnquiry({ packageName: 'Custom Holiday Planning' })}
                  activeOpacity={0.85}
                >
                  <Text style={s.heroSecondaryBtnText}>Plan Your Trip</Text>
                </TouchableOpacity>
              </View>

              {/* Micro Footnotes */}
              <View style={s.heroFootnotes}>
                <Text style={s.heroFootnoteItem}>✦ Curated Escapes</Text>
                <Text style={s.heroFootnoteItem}>✦ Personal Care</Text>
                <Text style={s.heroFootnoteItem}>✦ Transparent Pricing</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* 2. Stats Strip matching Website */}
        <View style={s.statsCard}>
          <View style={s.statItem}>
            <View style={s.statIconCircle}>
              <Ionicons name="happy-outline" size={18} color="#0284c7" />
            </View>
            <Text style={s.statNumber}>10,000+</Text>
            <Text style={s.statLabel}>Happy Travellers</Text>
          </View>

          <View style={s.statItem}>
            <View style={s.statIconCircle}>
              <Ionicons name="earth-outline" size={18} color="#0284c7" />
            </View>
            <Text style={s.statNumber}>50+</Text>
            <Text style={s.statLabel}>Destinations</Text>
          </View>

          <View style={s.statItem}>
            <View style={s.statIconCircle}>
              <Ionicons name="ribbon-outline" size={18} color="#0284c7" />
            </View>
            <Text style={s.statNumber}>12+ Years</Text>
            <Text style={s.statLabel}>Of Experience</Text>
          </View>

          <View style={s.statItem}>
            <View style={s.statIconCircle}>
              <Ionicons name="people-outline" size={18} color="#0284c7" />
            </View>
            <Text style={s.statNumber}>500+</Text>
            <Text style={s.statLabel}>Group Tours</Text>
          </View>
        </View>

        {/* 3. Our Specialized Key Destinations - Visual Photo Grid */}
        <View style={s.sectionHeader}>
          <View>
            <Text style={s.sectionEyebrow}>FIND YOUR NEXT ESCAPE</Text>
            <Text style={s.sectionTitle}>Our Specialized Key Destinations</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Packages')}
            style={s.seeAllLink}
            activeOpacity={0.7}
          >
            <Text style={s.seeAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={14} color="#0284c7" />
          </TouchableOpacity>
        </View>

        <View style={s.destinationsGrid}>
          {SPECIALIZED_DESTINATIONS.map((dest, idx) => {
            const imgSource = DESTINATION_IMAGES[dest.image] || DESTINATION_IMAGES['dubai-holiday'];
            return (
              <TouchableOpacity
                key={idx}
                style={s.destCard}
                activeOpacity={0.88}
                onPress={() =>
                  navigateToEnquiry({
                    service: 'tour',
                    packageName: `${dest.name} Tour`,
                  })
                }
              >
                <ImageBackground
                  source={imgSource}
                  style={s.destCardBg}
                  imageStyle={s.destCardBgImg}
                >
                  <View style={s.destCardOverlay}>
                    <View style={s.destTag}>
                      <Text style={s.destTagText}>{dest.tag || 'Specialized'}</Text>
                    </View>
                    <View>
                      <Text style={s.destName}>{dest.name}</Text>
                      <View style={s.destMetaRow}>
                        <Ionicons name="time-outline" size={11} color="#cbd5e1" />
                        <Text style={s.destDuration}>{dest.duration}</Text>
                      </View>
                      <View style={s.destEnquirePill}>
                        <Text style={s.destEnquireText}>Enquire Now</Text>
                        <Ionicons name="arrow-forward" size={11} color="#ffffff" />
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 4. Hajj & Umrah Pilgrimage Spotlight Band */}
        <View style={s.pilgrimBand}>
          <ImageBackground
            source={require('../../assets/destinations/makkah-kaaba.jpg')}
            style={s.pilgrimBg}
            imageStyle={s.pilgrimBgImg}
          >
            <View style={s.pilgrimOverlay}>
              <View style={s.pilgrimBadge}>
                <Ionicons name="moon" size={12} color="#fde68a" style={{ marginRight: 6 }} />
                <Text style={s.pilgrimBadgeText}>A JOURNEY OF FAITH</Text>
              </View>

              <Text style={s.pilgrimTitle}>Hajj &amp; Umrah Services</Text>
              <Text style={s.pilgrimSubtitle}>
                Economy &amp; 5-Star luxury packages in Makkah &amp; Madinah with walking proximity to the Holy Harams and scholar guidance.
              </Text>

              <View style={s.pilgrimActions}>
                <TouchableOpacity
                  style={s.pilgrimGoldBtn}
                  onPress={() => navigation.navigate('Hajj & Umrah')}
                  activeOpacity={0.88}
                >
                  <Text style={s.pilgrimGoldBtnText}>Explore Hajj &amp; Umrah</Text>
                  <Ionicons name="arrow-forward" size={13} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.pilgrimGhostBtn}
                  onPress={() => navigateToEnquiry({ service: 'umrah', packageName: 'Umrah Package Enquiry' })}
                  activeOpacity={0.85}
                >
                  <Text style={s.pilgrimGhostBtnText}>Send Pilgrimage Enquiry</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* 5. International Visa Services (Arranged in visual boxes like packages) */}
        <View style={s.sectionHeader}>
          <View>
            <Text style={s.sectionEyebrow}>GLOBAL VISA CONCIERGE</Text>
            <Text style={s.sectionTitle}>International Visa Services</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigateToEnquiry({ service: 'visa' })}
            style={s.seeAllLink}
            activeOpacity={0.7}
          >
            <Text style={s.seeAllText}>Visa Enquiry</Text>
            <Ionicons name="chevron-forward" size={14} color="#0284c7" />
          </TouchableOpacity>
        </View>

        <View style={s.visaGrid}>
          {VISA_SERVICES.map((v) => {
            const imgSource = DESTINATION_IMAGES[v.imageKey] || DESTINATION_IMAGES['dubai-holiday'];
            return (
              <View key={v.id} style={s.visaBox}>
                <ImageBackground
                  source={imgSource}
                  style={s.visaBoxBg}
                  imageStyle={s.visaBoxBgImg}
                >
                  <View style={s.visaBoxOverlay}>
                    <View style={s.visaTag}>
                      <Text style={s.visaTagText}>VISA SERVICE</Text>
                    </View>
                    <Text style={s.visaBoxTitle}>{v.title}</Text>
                    <Text style={s.visaBoxCategory}>{v.category}</Text>
                  </View>
                </ImageBackground>

                <View style={s.visaBoxBody}>
                  <Text style={s.visaBoxDesc}>{v.desc}</Text>
                  <TouchableOpacity
                    style={s.visaEnquireBtn}
                    onPress={() =>
                      navigateToEnquiry({
                        service: 'visa',
                        country: v.country,
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <Text style={s.visaEnquireBtnText}>Enquire Now</Text>
                    <Ionicons name="arrow-forward" size={12} color="#0284c7" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* 6. The SkyRay Way (Clean 4-feature grid) */}
        <View style={s.skyrayWayCard}>
          <Text style={s.skyrayWayEyebrow}>THE SKYRAY WAY</Text>
          <Text style={s.skyrayWayTitle}>Travel with Complete Confidence</Text>

          <View style={s.featuresGrid}>
            <View style={s.featureCell}>
              <View style={[s.featureIcon, { backgroundColor: '#e0f2fe' }]}>
                <Ionicons name="compass-outline" size={18} color="#0284c7" />
              </View>
              <Text style={s.featureTitle}>Thoughtful Planning</Text>
              <Text style={s.featureBody}>Itineraries tailored to your pace, dates &amp; budget.</Text>
            </View>

            <View style={s.featureCell}>
              <View style={[s.featureIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="person-outline" size={18} color="#d97706" />
              </View>
              <Text style={s.featureTitle}>Personal Guidance</Text>
              <Text style={s.featureBody}>Dedicated team with you before, during &amp; after.</Text>
            </View>

            <View style={s.featureCell}>
              <View style={[s.featureIcon, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#16a34a" />
              </View>
              <Text style={s.featureTitle}>Clear Information</Text>
              <Text style={s.featureBody}>No hidden surprises. Transparent quotes upfront.</Text>
            </View>

            <View style={s.featureCell}>
              <View style={[s.featureIcon, { backgroundColor: '#fae8ff' }]}>
                <Ionicons name="sparkles-outline" size={18} color="#9333ea" />
              </View>
              <Text style={s.featureTitle}>Memories That Last</Text>
              <Text style={s.featureBody}>Spiritual renewal, family joy &amp; cultural wonder.</Text>
            </View>
          </View>
        </View>

        {/* 7. Real Google Reviews Section (Authentic Customer Feedback) */}
        <View style={s.reviewsSection}>
          <View style={s.reviewsSectionHead}>
            <View>
              <Text style={s.sectionEyebrow}>TRAVELLER FEEDBACK</Text>
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

        {/* 8. Office Location & Contact Desk */}
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
              Mon – Sat: 9:30 AM – 8:30 PM (24/7 Dedicated Concierge)
            </Text>
          </View>
        </View>

        {/* 9. Instant Direct Call & WhatsApp Action Buttons */}
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
            style={s.callActionBtn}
            onPress={handleCall}
            activeOpacity={0.85}
          >
            <Ionicons name="call-outline" size={16} color="#0284c7" style={{ marginRight: 6 }} />
            <Text style={s.callActionText}>Call Desk</Text>
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
    marginBottom: 16,
    shadowColor: '#0f2942',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  heroBackground: {
    width: '100%',
    minHeight: 290,
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
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#38bdf8',
    fontSize: 9,
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
  heroTitleAccent: {
    color: '#38bdf8',
    fontStyle: 'italic',
  },
  heroTagline: {
    color: '#e2e8f0',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 18,
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
  heroFootnotes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroFootnoteItem: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
  },

  // 2. Stats Strip
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#17496b',
  },
  statLabel: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
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
  seeAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingBottom: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284c7',
  },

  // 3. Specialized Destinations Grid
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 22,
  },
  destCard: {
    width: CARD_WIDTH,
    height: 190,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  destCardBg: {
    width: '100%',
    height: '100%',
  },
  destCardBgImg: {
    borderRadius: 16,
  },
  destCardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    padding: 12,
    justifyContent: 'space-between',
  },
  destTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(2, 132, 199, 0.9)',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  destTagText: {
    color: '#ffffff',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  destName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  destMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    marginBottom: 6,
  },
  destDuration: {
    fontSize: 10,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  destEnquirePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  destEnquireText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },

  // 4. Pilgrimage Spotlight Band
  pilgrimBand: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  pilgrimBg: {
    width: '100%',
    minHeight: 220,
  },
  pilgrimBgImg: {
    borderRadius: 18,
  },
  pilgrimOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    padding: 20,
    justifyContent: 'center',
  },
  pilgrimBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(217, 119, 6, 0.3)',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.5)',
    marginBottom: 10,
  },
  pilgrimBadgeText: {
    color: '#fde68a',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pilgrimTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
  },
  pilgrimSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#e2e8f0',
    marginBottom: 16,
  },
  pilgrimActions: {
    flexDirection: 'row',
    gap: 10,
  },
  pilgrimGoldBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d97706',
    paddingVertical: 10,
    borderRadius: 9,
    gap: 5,
  },
  pilgrimGoldBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  pilgrimGhostBtn: {
    flex: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingVertical: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pilgrimGhostBtnText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },

  // 5. Visa Grid
  visaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  visaBox: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  visaBoxBg: {
    width: '100%',
    height: 95,
  },
  visaBoxBgImg: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  visaBoxOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 10,
    justifyContent: 'flex-end',
  },
  visaTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0284c7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  visaTagText: {
    color: '#ffffff',
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  visaBoxTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
  },
  visaBoxCategory: {
    fontSize: 9.5,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  visaBoxBody: {
    padding: 10,
  },
  visaBoxDesc: {
    fontSize: 10.5,
    lineHeight: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  visaEnquireBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bae6fd',
    gap: 4,
  },
  visaEnquireBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284c7',
  },

  // 6. The SkyRay Way
  skyrayWayCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  skyrayWayEyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: '#0284c7',
    marginBottom: 2,
  },
  skyrayWayTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f2942',
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCell: {
    width: (width - 76) / 2,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f2942',
    marginBottom: 3,
  },
  featureBody: {
    fontSize: 10.5,
    lineHeight: 14,
    color: '#64748b',
  },

  // 7. Google Reviews Section
  reviewsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
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
    paddingHorizontal: 9,
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
    marginBottom: 14,
  },
  realReviewCard: {
    backgroundColor: '#f8fbfe',
    borderRadius: 12,
    padding: 13,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reviewCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  authorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    color: '#ffffff',
    fontSize: 13,
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
    fontSize: 12,
    lineHeight: 17,
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

  // 8. Office Card
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

  // 9. Bottom Actions
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
  callActionBtn: {
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
  callActionText: {
    color: '#0284c7',
    fontWeight: '800',
    fontSize: 13,
  },
});
