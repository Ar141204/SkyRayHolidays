import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { C, BrandHeader, PrimaryButton, Badge } from '../components/UI';
import { API } from '../lib/api';
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_PHONE = '+91 91763 57791';
const DEFAULT_PHONE_SA = '+966 57 549 0602';
const DEFAULT_EMAIL = 'syedrahamathullah@skyrayholidays.com';
const DEFAULT_WHATSAPP = '+91 91763 57791';

export function AboutScreen() {
  return (
    <View style={s.container}>
      <BrandHeader subtitle="About SkyRay Holidays" />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.aboutHero}>
          <View style={s.kickerBadge}>
            <Text style={s.kickerText}>YOUR TRUSTED TRAVEL PARTNER</Text>
          </View>
          <Text style={s.aboutTitle}>About SkyRay Holidays</Text>
          <Text style={s.aboutBody}>
            We believe travel is more than reaching a destination — it is an enriching experience that connects you with new cultures, creates cherished family memories, and offers spiritual renewal.
          </Text>
        </View>

        {/* 4 Trust Metrics */}
        <View style={s.statsGrid}>
          <View style={s.statCard}>
            <Text style={s.statNum}>10,000+</Text>
            <Text style={s.statLabel}>Happy Travellers</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statNum}>50+</Text>
            <Text style={s.statLabel}>Destinations</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statNum}>4.9 ★</Text>
            <Text style={s.statLabel}>Google Rating</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statNum}>24/7</Text>
            <Text style={s.statLabel}>Concierge Support</Text>
          </View>
        </View>

        {/* Three Core Pillars */}
        <View style={s.pillarCard}>
          <View style={s.pillarHeader}>
            <View style={s.pillarIconBox}>
              <Ionicons name="compass-outline" size={18} color="#0ea5e9" />
            </View>
            <Text style={s.pillarTitle}>Our Mission</Text>
          </View>
          <Text style={s.pillarBody}>
            To make travel accessible, enjoyable, and effortless for every traveler through thoughtful planning, transparent pricing, and personalized itineraries.
          </Text>
        </View>

        <View style={s.pillarCard}>
          <View style={s.pillarHeader}>
            <View style={s.pillarIconBox}>
              <Ionicons name="sparkles-outline" size={18} color="#f59e0b" />
            </View>
            <Text style={s.pillarTitle}>Our Vision</Text>
          </View>
          <Text style={s.pillarBody}>
            To be the most trusted global travel and pilgrimage facilitator, celebrated for unwavering reliability, customer warmth, and spiritual integrity.
          </Text>
        </View>

        <View style={s.pillarCard}>
          <View style={s.pillarHeader}>
            <View style={s.pillarIconBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#10b981" />
            </View>
            <Text style={s.pillarTitle}>Why Choose Us</Text>
          </View>
          <Text style={s.pillarBody}>
            Handpicked 4-star and 5-star hotels, verified private chauffeurs, on-ground tour guides, transparent custom quotes, and dedicated 24/7 concierge support.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// SCREEN 7: Contact Screen
export function ContactScreen() {
  const [data, setData] = useState<any>({
    phone: DEFAULT_PHONE,
    whatsapp: DEFAULT_WHATSAPP,
    email: DEFAULT_EMAIL,
    address: '',
  });

  useEffect(() => {
    fetch(`${API}/settings/public`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((res: any) => {
        if (res && (res.phone || res.email)) setData(res);
      })
      .catch(() => {});
  }, []);

  const openUrl = (url?: string) => {
    if (url) Linking.openURL(url).catch(() => {});
  };

  const whatsappNumber = (data.whatsapp || DEFAULT_WHATSAPP).replace(/\D/g, '');

  return (
    <View style={s.container}>
      <BrandHeader subtitle="Reach Out to Our Travel Team" />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.contactHero}>
          <Text style={s.eyebrow}>WE ARE HERE TO HELP</Text>
          <Text style={s.contactHeroTitle}>Get in Touch</Text>
          <Text style={s.contactHeroBody}>
            Have questions about a destination or want a customized quote? Speak directly with our friendly travel specialists.
          </Text>
        </View>

        {/* WhatsApp Direct Hero Card */}
        <TouchableOpacity
          style={s.whatsappHeroCard}
          activeOpacity={0.9}
          onPress={() =>
            openUrl(
              `https://wa.me/919176357791?text=${encodeURIComponent(
                'Hello SkyRay Holidays! I would like to enquire about your tour packages.',
              )}`,
            )
          }
        >
          <View style={s.waIconCircle}>
            <Ionicons name="logo-whatsapp" size={24} color="#ffffff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.waCardTitle}>Chat Directly on WhatsApp</Text>
            <Text style={s.waCardSub}>Fastest replies for quotations &amp; inquiries</Text>
          </View>
          <Ionicons name="arrow-forward" size={17} color="#ffffff" />
        </TouchableOpacity>

        {/* Contact Methods */}
        <View style={s.contactListCard}>
          {/* Phone - India */}
          <TouchableOpacity
            style={s.contactItem}
            activeOpacity={0.7}
            onPress={() => openUrl(`tel:${DEFAULT_PHONE}`)}
          >
            <View style={s.contactIconBox}>
              <Ionicons name="call" size={17} color="#0ea5e9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.contactFieldLabel}>India Concierge Desk</Text>
              <Text style={s.contactFieldVal}>{DEFAULT_PHONE}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </TouchableOpacity>

          {/* Phone - Saudi Arabia */}
          <TouchableOpacity
            style={s.contactItem}
            activeOpacity={0.7}
            onPress={() => openUrl(`tel:${DEFAULT_PHONE_SA}`)}
          >
            <View style={s.contactIconBox}>
              <Ionicons name="call" size={17} color="#0ea5e9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.contactFieldLabel}>Saudi Arabia &amp; Pilgrimage Desk</Text>
              <Text style={s.contactFieldVal}>{DEFAULT_PHONE_SA}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            style={[s.contactItem, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={() => openUrl(`mailto:${data.email || DEFAULT_EMAIL}`)}
          >
            <View style={s.contactIconBox}>
              <Ionicons name="mail" size={17} color="#0ea5e9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.contactFieldLabel}>Official Email Address</Text>
              <Text style={s.contactFieldVal}>{data.email || DEFAULT_EMAIL}</Text>
              <Text style={s.hoursText}>24/7 Dedicated Concierge Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// SCREEN 8: Google Reviews Screen
const GOOGLE_REVIEWS_URL = 'https://maps.app.goo.gl/mzoUCar9aFRcQumW8';

const ORIGINAL_GOOGLE_REVIEWS = [
  {
    id: '1',
    name: 'Riyaz Ahamed',
    badge: 'Verified Google Review',
    rating: 5,
    date: 'Verified Review',
    comment: 'Great service, quick response, knowledge in immigration services.',
  },
  {
    id: '2',
    name: 'Mohamed Thasin',
    badge: 'Verified Google Review',
    rating: 5,
    date: 'Verified Review',
    comment: 'Excellent customer services and Kind personal care to customers.',
  },
  {
    id: '3',
    name: 'Abdul Rasheed',
    badge: 'Verified Google Review',
    rating: 5,
    date: 'Verified Review',
    comment: 'He was very patient and guided me and responded to all my queries.',
  },
];

export function ReviewsScreen() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API}/integrations/google-reviews`)
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res && res.available) setData(res);
      })
      .catch(() => {});
  }, []);

  const openGoogleMaps = () => {
    const url = data?.url || GOOGLE_REVIEWS_URL;
    Linking.openURL(url).catch(() => {});
  };

  const rating = data?.rating || 4.9;
  const reviewCount = data?.reviewCount || 34;

  const reviewsList =
    data?.reviews && data.reviews.length > 0
      ? data.reviews.map((r: any, idx: number) => ({
          id: String(idx + 1),
          name: r.author || 'Google Reviewer',
          badge: 'Verified Google Review',
          rating: r.rating || 5,
          date: r.publishTime || 'Verified Review',
          comment: r.text || '',
        }))
      : ORIGINAL_GOOGLE_REVIEWS;

  return (
    <View style={s.container}>
      <BrandHeader subtitle="Real Customer Reviews" />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Google Business Profile Header Card */}
        <View style={s.googleBusinessCard}>
          <View style={s.gbHeaderRow}>
            <View style={s.gbLeft}>
              <View style={s.googleGBox}>
                <Text style={s.googleGText}>G</Text>
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={s.gbBusinessName}>Skyray Holidays</Text>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                </View>
                <Text style={s.gbLocationText}>Global Travel &amp; Pilgrimage Specialists</Text>
              </View>
            </View>

            <TouchableOpacity
              style={s.verifiedPill}
              onPress={openGoogleMaps}
              activeOpacity={0.8}
            >
              <View style={s.greenDot} />
              <Text style={s.verifiedPillText}>Verified</Text>
            </TouchableOpacity>
          </View>

          {/* Rating Big Number & Stars */}
          <View style={s.ratingScoreRow}>
            <Text style={s.ratingScoreNum}>{Number(rating).toFixed(1)}</Text>
            <View style={{ marginLeft: 12, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={20}
                    color="#f59e0b"
                    style={{ marginRight: 3 }}
                  />
                ))}
              </View>
              <Text style={s.ratingCountText}>
                {reviewCount} reviews on Google Maps
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={s.openGoogleBtn}
            onPress={openGoogleMaps}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-google" size={16} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={s.openGoogleBtnText}>Read &amp; Rate on Google Maps</Text>
            <Ionicons name="open-outline" size={14} color="#ffffff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* Section Heading */}
        <View style={s.reviewsHeadRow}>
          <Text style={s.reviewsSectionTitle}>Authentic Google Reviews</Text>
          <Text style={s.reviewsSectionSub}>Direct from our verified travellers</Text>
        </View>

        {/* Review Cards */}
        {reviewsList.map((r: any) => (
          <View key={r.id} style={s.reviewCard}>
            <View style={s.reviewCardHeader}>
              <View style={s.avatarCircle}>
                <Text style={s.avatarInitial}>{r.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.reviewerName}>{r.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Ionicons name="shield-checkmark" size={11} color="#0284c7" style={{ marginRight: 3 }} />
                  <Text style={s.tripName}>{r.badge}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {[...Array(r.rating)].map((_, i) => (
                  <Ionicons key={i} name="star" size={13} color="#f59e0b" style={{ marginHorizontal: 0.5 }} />
                ))}
              </View>
            </View>
            <Text style={s.reviewComment}>&ldquo;{r.comment}&rdquo;</Text>
          </View>
        ))}

        {/* Bottom CTA to leave review */}
        <View style={s.leaveReviewCard}>
          <Ionicons name="sparkles" size={20} color="#0284c7" style={{ marginBottom: 6 }} />
          <Text style={s.leaveReviewTitle}>Traveled With Us Recently?</Text>
          <Text style={s.leaveReviewSub}>
            Your feedback helps us continuously improve our pilgrimage, visa, and tour services.
          </Text>
          <TouchableOpacity
            style={s.leaveReviewBtn}
            onPress={openGoogleMaps}
            activeOpacity={0.85}
          >
            <Text style={s.leaveReviewBtnText}>Share Your Review on Google</Text>
            <Ionicons name="arrow-forward" size={13} color="#0284c7" style={{ marginLeft: 4 }} />
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
    paddingTop: 16,
    paddingBottom: 36,
  },
  aboutHero: {
    backgroundColor: C.deep,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    shadowColor: C.deep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },
  kickerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 10,
  },
  kickerText: {
    color: '#93c5fd',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 28,
  },
  aboutBody: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '900',
    color: C.deep,
  },
  statLabel: {
    fontSize: 11,
    color: C.muted,
    fontWeight: '600',
    marginTop: 2,
  },
  pillarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pillarIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  pillarIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  pillarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.deep,
  },
  pillarBody: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
  },
  contactHero: {
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: C.skyDark,
    marginBottom: 4,
  },
  contactHeroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: C.deep,
    lineHeight: 30,
  },
  contactHeroBody: {
    fontSize: 13,
    color: C.muted,
    lineHeight: 19,
    marginTop: 6,
  },
  whatsappHeroCard: {
    backgroundColor: '#25D366',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  waIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  waIconLarge: {
    fontSize: 22,
  },
  waCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  waCardSub: {
    fontSize: 11.5,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 2,
  },
  waArrow: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '800',
  },
  contactListCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  contactIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactIconGlyph: {
    fontSize: 18,
  },
  contactFieldLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  contactFieldVal: {
    fontSize: 14,
    fontWeight: '800',
    color: C.deep,
    marginTop: 2,
  },
  hoursText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  itemArrow: {
    fontSize: 20,
    color: '#94a3b8',
    fontWeight: '700',
  },
  ratingHeroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  ratingHeroBig: {
    fontSize: 44,
    fontWeight: '900',
    color: C.deep,
    lineHeight: 48,
  },
  ratingHeroStars: {
    fontSize: 18,
    color: '#d97706',
    marginVertical: 4,
  },
  ratingHeroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.deep,
    marginTop: 2,
  },
  ratingHeroSub: {
    fontSize: 12.5,
    color: C.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
  // Google Reviews Styles
  googleBusinessCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  gbHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gbLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  googleGBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  googleGText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0284c7',
  },
  gbBusinessName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#17496b',
  },
  gbLocationText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  verifiedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  ratingScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  ratingScoreNum: {
    fontSize: 42,
    fontWeight: '900',
    color: '#17496b',
    lineHeight: 46,
  },
  ratingCountText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 3,
  },
  openGoogleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    borderRadius: 12,
  },
  openGoogleBtnText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
  },
  reviewsHeadRow: {
    marginBottom: 12,
  },
  reviewsSectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: C.deep,
  },
  reviewsSectionSub: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0369a1',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '800',
    color: C.deep,
  },
  tripName: {
    fontSize: 11,
    color: '#0284c7',
    fontWeight: '600',
  },
  cardStars: {
    color: '#d97706',
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  leaveReviewCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#bae6fd',
    alignItems: 'center',
    textAlign: 'center',
  },
  leaveReviewTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0369a1',
  },
  leaveReviewSub: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 12,
  },
  leaveReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0284c7',
  },
  leaveReviewBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0284c7',
  },
});
