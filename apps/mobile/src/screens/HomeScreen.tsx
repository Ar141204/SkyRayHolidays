import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrandHeader, PrimaryButton, C } from '../components/UI';

const FEATURED_PREVIEWS = [
  { id: '1', title: 'Dubai Holiday', slug: 'dubai-holiday', duration: '5 Days', price: '$499', icon: '✈' },
  { id: '2', title: 'Turkey Tour', slug: 'turkey-tour', duration: '7 Days', price: '$699', icon: '🏛' },
  { id: '3', title: 'Bali Escape', slug: 'bali-escape', duration: '6 Days', price: '$599', icon: '🌴' },
];

export function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={s.page}>
      <BrandHeader subtitle="Explore. Travel. Experience." />

      {/* Hero Banner Card matching Mobile Preview Screen 2 */}
      <View style={s.heroCard}>
        <Text style={s.eyebrow}>WHERE EVERY TRIP BECOMES A MEMORY</Text>
        <Text style={s.heroTitle}>
          Your Journey Begins with <Text style={{ color: '#FFE0A6' }}>SkyRay Holidays.</Text>
        </Text>
        <Text style={s.heroBody}>
          Discover unforgettable destinations, thoughtfully planned holidays and sacred pilgrimages.
        </Text>

        <TouchableOpacity style={s.heroBtn} onPress={() => navigation.navigate('Packages')}>
          <Text style={s.heroBtnText}>Explore Packages  ›</Text>
        </TouchableOpacity>

        <View style={s.heroFoot}>
          <Text style={s.heroFootText}>✦ Curated travel</Text>
          <Text style={s.heroFootText}>✦ Personal guidance</Text>
          <Text style={s.heroFootText}>✦ Best rates</Text>
        </View>
      </View>

      {/* "Our Packages" Section matching Mobile Preview Screen 2 */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Our Packages</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Packages')}>
            <Text style={s.viewAllLink}>View all →</Text>
          </TouchableOpacity>
        </View>

        {FEATURED_PREVIEWS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={s.packageCard}
            onPress={() => (navigation.getParent?.() || navigation).navigate('PackageDetail', { slug: item.slug })}
          >
            <View style={s.packageArt}>
              <Text style={{ fontSize: 26 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.pkgTitle}>{item.title}</Text>
              <Text style={s.pkgMeta}>{item.duration} · From {item.price}</Text>
              <Text style={s.pkgLink}>View details →</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Hajj & Umrah Banner */}
        <TouchableOpacity
          style={s.pilgrimQuickBanner}
          onPress={() => navigation.navigate('Hajj & Umrah')}
        >
          <Text style={{ fontSize: 28, marginRight: 14 }}>☾</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.pilgrimTitle}>Hajj &amp; Umrah Services</Text>
            <Text style={s.pilgrimSub}>Dedicated pilgrimage support &amp; 5-star stays</Text>
          </View>
          <Text style={s.pilgrimArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  heroCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: C.deep,
    padding: 24,
    paddingTop: 28,
    paddingBottom: 24,
    shadowColor: '#17496B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  eyebrow: { fontSize: 9, letterSpacing: 1.5, color: '#B8E7FB', fontWeight: '800' },
  heroTitle: { fontSize: 26, lineHeight: 32, fontWeight: '900', color: '#fff', marginTop: 12 },
  heroBody: { color: '#E1EDF3', lineHeight: 20, fontSize: 13, marginVertical: 14 },
  heroBtn: {
    backgroundColor: C.gold,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  heroBtnText: { color: '#17384D', fontWeight: '900', fontSize: 12 },
  heroFoot: { flexDirection: 'row', gap: 12, marginTop: 16 },
  heroFootText: { fontSize: 10, color: '#B8CCD7' },
  section: { paddingHorizontal: 16, paddingBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: C.deep },
  viewAllLink: { fontSize: 12, color: C.sky, fontWeight: '800' },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.line,
    marginBottom: 10,
    backgroundColor: '#FAFDFE',
    gap: 12,
  },
  packageArt: {
    width: 65,
    height: 65,
    borderRadius: 6,
    backgroundColor: C.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pkgTitle: { fontSize: 15, fontWeight: '900', color: C.deep },
  pkgMeta: { fontSize: 11, color: C.muted, marginVertical: 3 },
  pkgLink: { fontSize: 11, color: C.sky, fontWeight: '800' },
  pilgrimQuickBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F3249',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  pilgrimTitle: { color: '#fff', fontWeight: '900', fontSize: 14 },
  pilgrimSub: { color: '#B2C9D7', fontSize: 11, marginTop: 2 },
  pilgrimArrow: { color: C.sky, fontSize: 22, fontWeight: '900' },
});
