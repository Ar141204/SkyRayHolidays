import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { C, PrimaryButton, BrandHeader, Badge } from '../components/UI';

export function PilgrimageScreen({ navigation }: any) {
  const navigateToEnquiry = (packageName: string) => {
    (navigation.getParent?.() || navigation).navigate('Enquiry', { packageName });
  };

  return (
    <View style={s.container}>
      <BrandHeader
        subtitle="Hajj & Umrah Pilgrimage"
        onContactPress={() => navigation.navigate('Contact')}
      />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Spiritual Hero Banner */}
        <View style={s.hero}>
          <View style={s.kickerBadge}>
            <Text style={s.kickerText}>SACRED BLESSINGS</Text>
          </View>
          <Text style={s.heroTitle}>Hajj &amp; Umrah Services</Text>
          <Text style={s.heroBody}>
            Experience profound peace with dedicated scholars, 5-star hotels within walking distance of the Haram, VIP transfers, and complete visa facilitation.
          </Text>
        </View>

        {/* Featured Card: Premium Umrah Package */}
        <View style={s.card}>
          <View style={s.cardTop}>
            <View style={s.iconWrap}>
              <Text style={s.iconText}>☾</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.badgeRow}>
                <Badge label="BLESSED JOURNEY" variant="gold" />
                <Text style={s.durationPill}>10 Days / 9 Nights</Text>
              </View>
              <Text style={s.cardTitle}>Premium Umrah Package</Text>
              <Text style={s.cardDestination}>Makkah Al Mukarramah &amp; Madinah Al Munawwarah</Text>
            </View>
          </View>

          {/* Key Inclusions Checklist */}
          <View style={s.checklist}>
            <View style={s.checkRow}>
              <Text style={s.checkMark}>✔</Text>
              <Text style={s.checkLabel}>5-Star Hotels directly facing Haram / walking distance</Text>
            </View>
            <View style={s.checkRow}>
              <Text style={s.checkMark}>✔</Text>
              <Text style={s.checkLabel}>VIP Private / Haramain High-Speed Train Transfers</Text>
            </View>
            <View style={s.checkRow}>
              <Text style={s.checkMark}>✔</Text>
              <Text style={s.checkLabel}>Complete Saudi eVisa / Umrah Permit Processing</Text>
            </View>
            <View style={s.checkRow}>
              <Text style={s.checkMark}>✔</Text>
              <Text style={s.checkLabel}>Guided Ziyarat to Historical Holy Sites in Makkah &amp; Madinah</Text>
            </View>
          </View>

          <View style={s.cardFooter}>
            <View>
              <Text style={s.priceLabel}>Custom Quotation</Text>
              <Text style={s.priceValue}>Price on Enquiry</Text>
              <Text style={s.priceSub}>Based on hotel category &amp; travel month</Text>
            </View>
          </View>

          <View style={{ marginTop: 14 }}>
            <PrimaryButton
              title="Enquire for Umrah Quote"
              variant="gold"
              onPress={() => navigateToEnquiry('Premium Umrah Package')}
            />
          </View>
        </View>

        {/* Featured Card: Premium Hajj Package */}
        <View style={[s.card, { marginTop: 16 }]}>
          <View style={s.cardTop}>
            <View style={[s.iconWrap, { backgroundColor: '#fef3c7' }]}>
              <Text style={[s.iconText, { color: '#b45309' }]}>🕋</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.badgeRow}>
                <Badge label="ANNUAL OBLIGATION" variant="gold" />
                <Text style={s.durationPill}>14 - 21 Days</Text>
              </View>
              <Text style={s.cardTitle}>Premium Hajj Package</Text>
              <Text style={s.cardDestination}>Makkah, Mina, Arafat, Muzdalifah &amp; Madinah</Text>
            </View>
          </View>

          <View style={s.checklist}>
            <View style={s.checkRow}>
              <Text style={s.checkMark}>✔</Text>
              <Text style={s.checkLabel}>Pre-allotted luxury air-conditioned tents in Mina &amp; Arafat</Text>
            </View>
            <View style={s.checkRow}>
              <Text style={s.checkMark}>✔</Text>
              <Text style={s.checkLabel}>Dedicated Islamic scholars accompanying every group ritual</Text>
            </View>
            <View style={s.checkRow}>
              <Text style={s.checkMark}>✔</Text>
              <Text style={s.checkLabel}>Full Nusuk portal registration assistance and documentation</Text>
            </View>
          </View>

          <View style={s.cardFooter}>
            <View>
              <Text style={s.priceLabel}>Official Hajj Allocation</Text>
              <Text style={s.priceValue}>Price on Enquiry</Text>
              <Text style={s.priceSub}>Subject to Saudi Ministry Hajj allocations</Text>
            </View>
          </View>

          <View style={{ marginTop: 14 }}>
            <PrimaryButton
              title="Enquire for Hajj Information"
              onPress={() => navigateToEnquiry('Premium Hajj Package')}
            />
          </View>
        </View>

        {/* Advisory Box */}
        <View style={s.advisoryBox}>
          <Text style={s.advisoryTitle}>Official Compliance Notice</Text>
          <Text style={s.advisoryBody}>
            SkyRay Holidays facilitates pilgrimage in full compliance with the Ministry of Hajj and Umrah regulations. Hotel allocations, flights, and visas are confirmed upon direct verification.
          </Text>
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
  hero: {
    backgroundColor: '#0f2942',
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    shadowColor: '#0f2942',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },
  kickerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  kickerText: {
    color: '#fde68a',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '900',
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  heroBody: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 24,
    color: C.deep,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  durationPill: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.deep,
    lineHeight: 22,
  },
  cardDestination: {
    fontSize: 12,
    color: C.muted,
    marginTop: 3,
  },
  checklist: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkMark: {
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '900',
    marginRight: 8,
    marginTop: 1,
  },
  checkLabel: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 17,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: C.deep,
    marginTop: 2,
  },
  priceSub: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 2,
  },
  advisoryBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: C.sky,
  },
  advisoryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: C.deep,
    marginBottom: 4,
  },
  advisoryBody: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 17,
  },
});
