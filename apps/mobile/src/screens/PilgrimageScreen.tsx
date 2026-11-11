import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { C, PrimaryButton, ScreenTitle } from '../components/UI';

export function PilgrimageScreen({ navigation }: any) {
  return (
    <ScrollView style={s.page}>
      <View style={s.hero}>
        <Text style={s.kicker}>A JOURNEY OF FAITH</Text>
        <Text style={s.heroTitle}>Hajj &amp; Umrah Services</Text>
        <Text style={s.heroBody}>
          A Blessed Journey. Experience spiritual peace with dedicated scholars, 5-star hotels near the Haram, and personalized care.
        </Text>
      </View>

      <View style={s.content}>
        <ScreenTitle
          eyebrow="Pilgrimage Services"
          title="Featured Pilgrimage Packages"
          body="Complete arrangements with visa assistance, luxury accommodation, and guidance."
        />

        {/* Featured Card matching Mobile Preview Screen 4: Premium Umrah */}
        <View style={s.featuredCard}>
          <View style={s.cardImageHeader}>
            <Text style={{ fontSize: 40 }}>☾</Text>
            <View style={s.badge}>
              <Text style={s.badgeText}>BLESSED JOURNEY</Text>
            </View>
          </View>

          <View style={s.cardBody}>
            <Text style={s.cardTitle}>Premium Umrah Package</Text>
            <Text style={s.cardMeta}>10 Days · Makkah &amp; Madinah</Text>
            <Text style={s.priceTag}>From $2,499</Text>

            <View style={s.checklist}>
              <Text style={s.checkItem}>✔ 5-Star Hotel near Haram</Text>
              <Text style={s.checkItem}>✔ VIP Air-conditioned Transfers</Text>
              <Text style={s.checkItem}>✔ Full Visa Processing Support</Text>
              <Text style={s.checkItem}>✔ Ziyarat Holy Sites Visits</Text>
            </View>

            <PrimaryButton
              title="Enquire Now"
              onPress={() =>
                (navigation.getParent?.() || navigation).navigate('Enquiry', {
                  packageName: 'Premium Umrah Package',
                })
              }
            />
          </View>
        </View>

        {/* Premium Hajj Card */}
        <View style={[s.featuredCard, { marginTop: 16 }]}>
          <View style={s.cardBody}>
            <Text style={s.cardTitle}>Premium Hajj Package</Text>
            <Text style={s.cardMeta}>14 Days · Complete Guidance</Text>
            <Text style={s.priceTag}>From $4,999</Text>

            <View style={s.checklist}>
              <Text style={s.checkItem}>✔ Luxury Stay within Walking Distance</Text>
              <Text style={s.checkItem}>✔ Haramain High-Speed Train</Text>
              <Text style={s.checkItem}>✔ Dedicated Scholars for All Rites</Text>
            </View>

            <PrimaryButton
              title="Enquire About Hajj"
              onPress={() =>
                (navigation.getParent?.() || navigation).navigate('Enquiry', {
                  packageName: 'Premium Hajj Package',
                })
              }
            />
          </View>
        </View>

        <Text style={s.note}>
          Important: Dates, hotel allocations, and official visas are confirmed by SkyRay Holidays in accordance with Saudi Ministry guidelines.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  hero: { backgroundColor: C.deep, padding: 22, paddingTop: 36 },
  kicker: { fontSize: 10, color: '#BFEAFF', fontWeight: '900', letterSpacing: 2 },
  heroTitle: { fontSize: 28, color: '#fff', fontWeight: '900', lineHeight: 34, marginVertical: 10 },
  heroBody: { color: '#D3E3EB', fontSize: 13, lineHeight: 20 },
  content: { padding: 18 },
  featuredCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.line,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#17496B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImageHeader: {
    height: 110,
    backgroundColor: '#0F334A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: C.gold,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#17384D' },
  cardBody: { padding: 18 },
  cardTitle: { fontSize: 18, fontWeight: '900', color: C.deep },
  cardMeta: { fontSize: 12, color: C.muted, marginVertical: 4 },
  priceTag: { fontSize: 18, fontWeight: '900', color: C.sky, marginVertical: 6 },
  checklist: { marginVertical: 12, gap: 5 },
  checkItem: { fontSize: 12, color: '#3A4D5C', fontWeight: '600' },
  note: {
    backgroundColor: C.pale,
    color: C.deep,
    padding: 14,
    fontSize: 11,
    lineHeight: 17,
    borderRadius: 6,
    marginTop: 20,
  },
});
