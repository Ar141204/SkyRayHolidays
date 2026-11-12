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

const DEFAULT_PHONE = '+91 98765 43210';
const DEFAULT_EMAIL = 'info@skyrayholidays.com';
const DEFAULT_WHATSAPP = '+91 98765 43210';
const DEFAULT_ADDRESS = '123 Travel Street, Chennai, TN 600001';

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
            <Text style={s.statNum}>1,200+</Text>
            <Text style={s.statLabel}>Happy Travelers</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statNum}>50+</Text>
            <Text style={s.statLabel}>Curated Packages</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statNum}>4.8 ★</Text>
            <Text style={s.statLabel}>Google Rating</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statNum}>24/7</Text>
            <Text style={s.statLabel}>Travel Support</Text>
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
    address: DEFAULT_ADDRESS,
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
              `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
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
          {/* Phone */}
          <TouchableOpacity
            style={s.contactItem}
            activeOpacity={0.7}
            onPress={() => openUrl(`tel:${data.phone || DEFAULT_PHONE}`)}
          >
            <View style={s.contactIconBox}>
              <Ionicons name="call" size={17} color="#0ea5e9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.contactFieldLabel}>Call Customer Desk</Text>
              <Text style={s.contactFieldVal}>{data.phone || DEFAULT_PHONE}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            style={s.contactItem}
            activeOpacity={0.7}
            onPress={() => openUrl(`mailto:${data.email || DEFAULT_EMAIL}`)}
          >
            <View style={s.contactIconBox}>
              <Ionicons name="mail" size={17} color="#0ea5e9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.contactFieldLabel}>Email Address</Text>
              <Text style={s.contactFieldVal}>{data.email || DEFAULT_EMAIL}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </TouchableOpacity>

          {/* Office Address */}
          <TouchableOpacity
            style={[s.contactItem, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={() => openUrl('https://maps.google.com/?q=Chennai+TN+India')}
          >
            <View style={s.contactIconBox}>
              <Ionicons name="location" size={17} color="#0ea5e9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.contactFieldLabel}>Head Office</Text>
              <Text style={s.contactFieldVal}>{data.address || DEFAULT_ADDRESS}</Text>
              <Text style={s.hoursText}>Mon - Sat: 9:00 AM - 7:00 PM IST</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// SCREEN 8: Google Reviews Screen
export function ReviewsScreen() {
  const reviews = [
    {
      id: '1',
      name: 'Priya Sharma',
      trip: 'Kashmir Paradise Experience',
      rating: 5,
      date: 'October 2026',
      comment:
        'Our family trip to Kashmir was absolutely unforgettable! The houseboat in Dal Lake was spotless, and our driver was courteous and knowledgeable throughout Pahalgam and Gulmarg.',
    },
    {
      id: '2',
      name: 'Mohammed Farooq',
      trip: 'Premium Umrah Package',
      rating: 5,
      date: 'September 2026',
      comment:
        'Alhamdulillah, SkyRay Holidays took care of every single detail. Our hotel was literally 2 minutes from the Haram in Makkah, and the Haramain train transfers made travel effortless.',
    },
    {
      id: '3',
      name: 'Rajesh & Sneha',
      trip: 'Kerala Backwaters Getaway',
      rating: 5,
      date: 'August 2026',
      comment:
        'The Alleppey houseboat experience was pure bliss! From the authentic Kerala meals to the serene sunset cruise in Munnar, everything exceeded our expectations.',
    },
    {
      id: '4',
      name: 'Arun Kumar',
      trip: 'Dubai Holiday Package',
      rating: 5,
      date: 'July 2026',
      comment:
        'Seamless desert safari, premium Marina dinner cruise, and great hotel stay. The itinerary was perfectly paced with no rush. Highly recommend SkyRay Holidays!',
    },
  ];

  return (
    <View style={s.container}>
      <BrandHeader subtitle="Traveler Testimonials" />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Rating Hero Card */}
        <View style={s.ratingHeroCard}>
          <Text style={s.ratingHeroBig}>4.8</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
            {[...Array(5)].map((_, i) => (
              <Ionicons key={i} name="star" size={16} color="#f59e0b" style={{ marginHorizontal: 1 }} />
            ))}
          </View>
          <Text style={s.ratingHeroTitle}>Rated 4.8 / 5 on Google</Text>
          <Text style={s.ratingHeroSub}>
            Based on 1,200+ verified customer reviews across domestic &amp; international tours.
          </Text>
        </View>

        <Text style={s.reviewsSectionTitle}>Customer Testimonials</Text>

        {/* Review Cards */}
        {reviews.map((r) => (
          <View key={r.id} style={s.reviewCard}>
            <View style={s.reviewCardHeader}>
              <View style={s.avatarCircle}>
                <Text style={s.avatarInitial}>{r.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.reviewerName}>{r.name}</Text>
                <Text style={s.tripName}>{r.trip} · {r.date}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {[...Array(r.rating)].map((_, i) => (
                  <Ionicons key={i} name="star" size={11} color="#f59e0b" style={{ marginHorizontal: 0.5 }} />
                ))}
              </View>
            </View>
            <Text style={s.reviewComment}>{r.comment}</Text>
          </View>
        ))}
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
  reviewsSectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: C.deep,
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
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
    color: C.muted,
    marginTop: 1,
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
});
