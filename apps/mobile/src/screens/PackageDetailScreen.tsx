import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { API, TourPackage, getFallbackPackage } from '../lib/api';
import { C, PrimaryButton } from '../components/UI';

export function PackageDetailScreen({ route, navigation }: any) {
  const [item, setItem] = useState<TourPackage | null>(null);

  useEffect(() => {
    fetch(`${API}/packages/${route.params.slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Package not found'))))
      .then(setItem)
      .catch(() => {
        setItem(getFallbackPackage(route.params.slug));
      });
  }, [route.params.slug]);

  if (!item) {
    return (
      <View style={[s.page, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={C.sky} />
      </View>
    );
  }

  const inclusions = Array.isArray(item.inclusions) && item.inclusions.length > 0
    ? item.inclusions
    : ['Flight Tickets', 'Hotel Stay', 'City Tour', 'Transfers'];

  return (
    <ScrollView style={s.page} contentContainerStyle={{ paddingBottom: 36 }}>
      {/* Photo Header */}
      <View style={s.heroArt}>
        <Text style={{ fontSize: 44 }}>✈</Text>
        <View style={s.kindBadge}>
          <Text style={s.kindBadgeText}>{item.kind === 'TOUR' ? 'HOLIDAY' : item.kind}</Text>
        </View>
      </View>

      <View style={s.content}>
        {/* Title & Reviews matching Mobile Preview Screen 5 */}
        <Text style={s.heroTitle}>{item.title}</Text>
        <Text style={s.meta}>{item.destination} · {item.duration}</Text>

        <View style={s.ratingRow}>
          <Text style={s.stars}>★★★★★</Text>
          <Text style={s.ratingScore}>4.8</Text>
          <Text style={s.reviewsCount}>(120 Reviews)</Text>
        </View>

        <View style={s.priceBox}>
          <Text style={s.priceLabel}>From</Text>
          <Text style={s.priceAmount}>{item.currency || '$'}{item.priceFrom || 499}</Text>
          <Text style={s.priceSub}>per person / twin sharing</Text>
        </View>

        {/* Primary CTA matching Mobile Preview Screen 5 */}
        <View style={{ marginVertical: 14 }}>
          <PrimaryButton
            title="Enquire Now"
            onPress={() =>
              navigation.navigate('Enquiry', {
                packageId: item.id,
                packageName: item.title,
              })
            }
          />
        </View>

        <Text style={s.heading}>Overview</Text>
        <Text style={s.body}>{item.description || item.summary}</Text>

        <Text style={s.heading}>What&apos;s Included</Text>
        <View style={s.checklist}>
          {inclusions.map((inc, i) => (
            <Text style={s.checkItem} key={i}>
              ✔  {typeof inc === 'string' ? inc : JSON.stringify(inc)}
            </Text>
          ))}
        </View>

        <Text style={s.note}>
          Dates, availability, hotel accommodation and final pricing are confirmed by SkyRay Holidays when you enquire.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  heroArt: {
    height: 180,
    backgroundColor: C.deep,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  kindBadge: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    backgroundColor: C.sky,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  kindBadgeText: { fontSize: 9, fontWeight: '900', color: '#fff' },
  content: { padding: 20 },
  heroTitle: { fontSize: 24, color: C.deep, fontWeight: '900' },
  meta: { fontSize: 12, color: C.muted, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 8 },
  stars: { color: '#F59E0B', fontSize: 14 },
  ratingScore: { fontWeight: '900', color: C.deep, fontSize: 13 },
  reviewsCount: { color: C.muted, fontSize: 11 },
  priceBox: {
    backgroundColor: C.pale,
    padding: 14,
    borderRadius: 8,
    marginVertical: 10,
  },
  priceLabel: { fontSize: 10, color: C.muted, fontWeight: '700' },
  priceAmount: { fontSize: 24, fontWeight: '900', color: C.deep },
  priceSub: { fontSize: 10, color: C.muted, marginTop: 2 },
  heading: { fontSize: 16, color: C.deep, fontWeight: '900', marginTop: 16, marginBottom: 8 },
  body: { fontSize: 12, color: C.muted, lineHeight: 19 },
  checklist: { gap: 6, marginVertical: 6 },
  checkItem: { fontSize: 12, color: '#2B4050', fontWeight: '600' },
  note: {
    backgroundColor: C.pale,
    color: C.deep,
    padding: 12,
    fontSize: 10,
    lineHeight: 16,
    borderRadius: 6,
    marginTop: 20,
  },
});
