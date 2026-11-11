import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { C, ScreenTitle } from '../components/UI';
import { API } from '../lib/api';

const DEFAULT_PHONE = '+91 98765 43210';
const DEFAULT_EMAIL = 'info@skyrayholidays.com';
const DEFAULT_WHATSAPP = '+91 98765 43210';
const DEFAULT_ADDRESS = '123 Travel Street, Chennai, TN 600001';

export function AboutScreen() {
  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <ScreenTitle
        eyebrow="A little about us"
        title="About SkyRay Holidays"
        body="Your Trusted Travel Partner. We believe travel is more than reaching a place — it's an experience that connects you to new cultures, beautiful places and lasting memories."
      />

      <View style={s.card}>
        <Text style={s.heading}>Our Mission</Text>
        <Text style={s.body}>
          To make travel accessible, enriching and memorable for everyone through thoughtful planning and transparent service.
        </Text>

        <Text style={s.heading}>Our Vision</Text>
        <Text style={s.body}>
          To be a leading global travel brand recognized for exceptional customer care and trustworthy pilgrimage services.
        </Text>

        <Text style={s.heading}>Why Choose Us</Text>
        <Text style={s.body}>
          Unmatched service, care and trust. We confirm all details upfront and provide 24/7 travel assistance.
        </Text>
      </View>
    </ScrollView>
  );
}

// SCREEN 7: Contact Screen matching Mobile Preview Screen 7
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
      .then((res) => {
        if (res.phone || res.email) setData(res);
      })
      .catch(() => {});
  }, []);

  const openUrl = (url?: string) => {
    if (url) Linking.openURL(url).catch(() => {});
  };

  const whatsappNumber = (data.whatsapp || DEFAULT_WHATSAPP).replace(/\D/g, '');

  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <ScreenTitle
        eyebrow="We're here to help"
        title="Contact"
        body="Reach the SkyRay Holidays team through phone, email or direct WhatsApp chat."
      />

      <View style={s.contactCard}>
        {/* Phone */}
        <TouchableOpacity
          style={s.contactRow}
          onPress={() => openUrl(`tel:${data.phone || DEFAULT_PHONE}`)}
        >
          <View style={s.contactIconWrap}><Text style={s.iconGlyph}>📞</Text></View>
          <View>
            <Text style={s.contactLabel}>Phone Number</Text>
            <Text style={s.contactVal}>{data.phone || DEFAULT_PHONE}</Text>
          </View>
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity
          style={s.contactRow}
          onPress={() => openUrl(`mailto:${data.email || DEFAULT_EMAIL}`)}
        >
          <View style={s.contactIconWrap}><Text style={s.iconGlyph}>✉</Text></View>
          <View>
            <Text style={s.contactLabel}>Email Address</Text>
            <Text style={s.contactVal}>{data.email || DEFAULT_EMAIL}</Text>
          </View>
        </TouchableOpacity>

        {/* Address */}
        <View style={s.contactRow}>
          <View style={s.contactIconWrap}><Text style={s.iconGlyph}>📍</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.contactLabel}>Office Address</Text>
            <Text style={s.contactVal}>{data.address || DEFAULT_ADDRESS}</Text>
          </View>
        </View>

        {/* Big Green WhatsApp Button matching Mobile Preview Screen 7 */}
        <TouchableOpacity
          style={s.whatsAppBtn}
          onPress={() =>
            openUrl(
              `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Hello SkyRay Holidays! I would like to inquire about a travel package.',
              )}`,
            )
          }
        >
          <Text style={s.whatsAppBtnText}>💬  Chat on WhatsApp</Text>
        </TouchableOpacity>

        {/* Map Preview Graphic */}
        <View style={s.mapBox}>
          <Text style={{ fontSize: 32 }}>🗺</Text>
          <Text style={s.mapTitle}>SkyRay Holidays Office</Text>
          <Text style={s.mapSub}>Chennai, Tamil Nadu, India</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// SCREEN 8: Google Reviews Screen matching Mobile Preview Screen 8
export function ReviewsScreen() {
  const reviews = [
    {
      id: '1',
      author: 'Priya Sharma',
      rating: 5,
      date: '2 weeks ago',
      text: 'Amazing experience! The Dubai trip was perfectly organized from airport pickup to desert safari. Our family loved every minute.',
    },
    {
      id: '2',
      author: 'Mohammed Farooq',
      rating: 5,
      date: '1 month ago',
      text: 'Our Umrah journey was truly peaceful. 5-star hotels were within a 3-minute walk to Haram as promised. Highly recommend their guidance team.',
    },
    {
      id: '3',
      author: 'Ananya & Rohit Verma',
      rating: 5,
      date: '1 month ago',
      text: 'Booked the Bali honeymoon package with SkyRay. The private pool villa and Nusa Penida tour were breathtaking. 10/10 service!',
    },
    {
      id: '4',
      author: 'Karthik Raja',
      rating: 4.8,
      date: '2 months ago',
      text: 'Very professional agency. Prompt replies on WhatsApp, clear documentation, and great hotel choices in Istanbul.',
    },
  ];

  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <ScreenTitle
        eyebrow="Traveller Feedback"
        title="Google Reviews"
        body="Authentic reviews and ratings from travellers who explored the world with SkyRay."
      />

      {/* Prominent Rating Card matching Mobile Preview Screen 8 */}
      <View style={s.ratingHeroCard}>
        <Text style={s.bigScore}>4.8</Text>
        <Text style={s.starString}>★★★★★</Text>
        <Text style={s.reviewsCountLabel}>(1.2K Reviews)</Text>
      </View>

      {/* Customer Review List matching Mobile Preview Screen 8 */}
      <View style={s.reviewsList}>
        {reviews.map((r) => (
          <View key={r.id} style={s.reviewCard}>
            <View style={s.reviewCardHead}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{r.author.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.reviewerName}>{r.author}</Text>
                <Text style={s.reviewDate}>{r.date}</Text>
              </View>
              <Text style={s.cardStars}>{'★'.repeat(Math.round(r.rating))}</Text>
            </View>
            <Text style={s.reviewText}>{r.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  card: { padding: 18, borderWidth: 1, borderColor: C.line, borderRadius: 8, marginTop: 12 },
  heading: { fontSize: 16, fontWeight: '900', color: C.deep, marginTop: 14, marginBottom: 4 },
  body: { fontSize: 12, color: C.muted, lineHeight: 20 },

  // Contact styles
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.line,
    padding: 18,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F7',
  },
  contactIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: { fontSize: 18 },
  contactLabel: { fontSize: 10, color: C.muted, fontWeight: '700' },
  contactVal: { fontSize: 13, color: C.deep, fontWeight: '800', marginTop: 2 },
  whatsAppBtn: {
    backgroundColor: '#25D366',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#25D366',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  whatsAppBtnText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  mapBox: {
    marginTop: 18,
    height: 120,
    backgroundColor: '#EEF6FA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4E8F2',
  },
  mapTitle: { fontSize: 13, fontWeight: '900', color: C.deep, marginTop: 4 },
  mapSub: { fontSize: 10, color: C.muted },

  // Reviews styles matching Preview Screen 8
  ratingHeroCard: {
    backgroundColor: '#FAFDFE',
    borderWidth: 1,
    borderColor: '#E1EDF3',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  bigScore: { fontSize: 48, fontWeight: '900', color: C.deep },
  starString: { fontSize: 24, color: '#F59E0B', marginVertical: 4 },
  reviewsCountLabel: { fontSize: 12, color: C.muted, fontWeight: '700' },
  reviewsList: { marginTop: 16, gap: 12 },
  reviewCard: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fff',
  },
  reviewCardHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  reviewerName: { fontSize: 13, fontWeight: '800', color: C.deep },
  reviewDate: { fontSize: 10, color: C.muted },
  cardStars: { fontSize: 13, color: '#F59E0B' },
  reviewText: { fontSize: 12, color: '#445663', lineHeight: 18 },
});
