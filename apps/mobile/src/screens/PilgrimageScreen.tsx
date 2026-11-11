import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { C, PrimaryButton, BrandHeader, Badge } from '../components/UI';
import { getPackageImage } from '../lib/api';

export function PilgrimageScreen({ navigation }: any) {
  const navigateToEnquiry = (packageName: string) => {
    (navigation.getParent?.() || navigation).navigate('Enquiry', { packageName });
  };

  const navigateToPackage = (slug: string) => {
    try {
      navigation.navigate('PackageDetail', { slug });
    } catch {
      try {
        navigation.getParent?.()?.navigate('PackageDetail', { slug });
      } catch (e) {
        console.warn('Navigation error:', e);
      }
    }
  };

  const meccaImg = getPackageImage('premium-hajj-package');
  const madinahImg = getPackageImage('premium-umrah');

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
          <View style={s.imageFrame}>
            <Image
              source={madinahImg}
              style={s.coverImage}
              resizeMode="cover"
            />
            <View style={s.imageGradientOverlay} />
            <View style={s.floatingTopRow}>
              <View style={[s.categoryTag, s.categoryTagGold]}>
                <Text style={s.categoryTagText}>☾ BLESSED JOURNEY</Text>
              </View>
              <View style={s.ratingBadge}>
                <Text style={s.ratingStar}>★</Text>
                <Text style={s.ratingScore}>5.0</Text>
              </View>
            </View>
            <View style={s.floatingBottomRow}>
              <View style={s.durationPill}>
                <Text style={s.durationText}>⏱ 10 Days / 9 Nights</Text>
              </View>
            </View>
          </View>

          <View style={s.cardBody}>
            <Text style={s.cardTitle}>Premium Umrah Package</Text>
            <Text style={s.cardDestination}>📍 Makkah Al Mukarramah &amp; Madinah Al Munawwarah</Text>

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

            <View style={s.btnRow}>
              <TouchableOpacity
                style={s.viewDetailsBtn}
                onPress={() => navigateToPackage('premium-umrah')}
                activeOpacity={0.85}
              >
                <Text style={s.viewDetailsText}>View Details →</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.enquireBtn}
                onPress={() => navigateToEnquiry('Premium Umrah Package')}
                activeOpacity={0.85}
              >
                <Text style={s.enquireBtnText}>Enquire Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Featured Card: Premium Hajj Package */}
        <View style={[s.card, { marginTop: 18 }]}>
          <View style={s.imageFrame}>
            <Image
              source={meccaImg}
              style={s.coverImage}
              resizeMode="cover"
            />
            <View style={s.imageGradientOverlay} />
            <View style={s.floatingTopRow}>
              <View style={[s.categoryTag, s.categoryTagGold]}>
                <Text style={s.categoryTagText}>🕋 ANNUAL OBLIGATION</Text>
              </View>
              <View style={s.ratingBadge}>
                <Text style={s.ratingStar}>★</Text>
                <Text style={s.ratingScore}>5.0</Text>
              </View>
            </View>
            <View style={s.floatingBottomRow}>
              <View style={s.durationPill}>
                <Text style={s.durationText}>⏱ 14 - 21 Days</Text>
              </View>
            </View>
          </View>

          <View style={s.cardBody}>
            <Text style={s.cardTitle}>Premium Hajj Package</Text>
            <Text style={s.cardDestination}>📍 Makkah, Mina, Arafat, Muzdalifah &amp; Madinah</Text>

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

            <View style={s.btnRow}>
              <TouchableOpacity
                style={s.viewDetailsBtn}
                onPress={() => navigateToPackage('premium-hajj-package')}
                activeOpacity={0.85}
              >
                <Text style={s.viewDetailsText}>View Details →</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.enquireBtn}
                onPress={() => navigateToEnquiry('Premium Hajj Package')}
                activeOpacity={0.85}
              >
                <Text style={s.enquireBtnText}>Enquire Now</Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 40,
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
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  imageFrame: {
    width: '100%',
    height: 180,
    backgroundColor: '#0f172a',
    position: 'relative',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageGradientOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
  },
  floatingTopRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  categoryTag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  categoryTagGold: {
    backgroundColor: 'rgba(217, 119, 6, 0.92)',
  },
  categoryTagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  ratingStar: {
    color: '#f59e0b',
    fontSize: 12,
    marginRight: 3,
  },
  ratingScore: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
  },
  floatingBottomRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    zIndex: 2,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f2942',
    lineHeight: 23,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardDestination: {
    fontSize: 12.5,
    color: '#64748b',
    marginBottom: 12,
    fontWeight: '600',
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
    fontSize: 9.5,
    color: '#0284c7',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f2942',
    marginTop: 2,
  },
  priceSub: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  viewDetailsBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    paddingVertical: 12,
    borderRadius: 10,
  },
  viewDetailsText: {
    color: '#0284c7',
    fontSize: 13,
    fontWeight: '800',
  },
  enquireBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d97706',
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  enquireBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
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

