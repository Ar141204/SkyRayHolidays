import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  getPackagesWithStatus,
  TourPackage,
  getPackageImage,
  DESTINATION_IMAGES,
  getVisaServices,
} from '../lib/api';
import {
  VISA_SERVICES,
  SCHENGEN_MEMBER_COUNTRIES,
  POPULAR_EVISA_COUNTRIES,
  GCC_COUNTRIES,
  VisaServiceItem,
} from '../lib/visas';
import { C, BrandHeader } from '../components/UI';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CATEGORIES: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'All', label: 'All Escapes', icon: 'compass-outline' },
  { id: 'Specialized', label: 'Specialized Keys', icon: 'star-outline' },
  { id: 'International', label: 'International', icon: 'airplane-outline' },
  { id: 'Domestic', label: 'Within India', icon: 'map-outline' },
];

export function ServicesScreen({ route, navigation }: any) {
  const initialTabParam = route.params?.initialTab;
  const [activeTab, setActiveTab] = useState<'all' | 'packages' | 'visa'>('all');
  const [items, setItems] = useState<TourPackage[]>([]);
  const [visas, setVisas] = useState<VisaServiceItem[]>(VISA_SERVICES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  // Accordion toggles for visa country lists
  const [showSchengenList, setShowSchengenList] = useState(false);
  const [showGccList, setShowGccList] = useState(false);
  const [showEvisaList, setShowEvisaList] = useState(false);

  useEffect(() => {
    if (initialTabParam === 'packages' || initialTabParam === 'tours') {
      setActiveTab('packages');
    } else if (initialTabParam === 'visa' || initialTabParam === 'visas') {
      setActiveTab('visa');
    } else if (initialTabParam === 'all') {
      setActiveTab('all');
    }
  }, [initialTabParam]);

  const loadData = useCallback(async () => {
    try {
      const pkgPromise = getPackagesWithStatus()
        .then((res) => {
          setItems(res.packages);
          setIsOffline(res.isOffline);
        })
        .catch((e) => {
          setError(e.message);
          setIsOffline(true);
        });

      const visaPromise = getVisaServices()
        .then((vList) => {
          if (Array.isArray(vList) && vList.length > 0) {
            setVisas(vList);
          }
        })
        .catch(() => {});

      await Promise.allSettled([pkgPromise, visaPromise]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredPackages = useMemo(() => {
    return items.filter((p) => {
      // Exclude Hajj and Umrah packages: they have their own dedicated Hajj & Umrah tab!
      if (p.kind === 'HAJJ' || p.kind === 'UMRAH') return false;

      const isSpecialized =
        p.category === 'Specialized' ||
        ['reunion', 'russia', 'turkey', 'mauritius', 'maldives', 'seychelles', 'armenia', 'georgia', 'azerbaijan'].some(
          (k) => p.slug?.toLowerCase().includes(k) || p.destination?.toLowerCase().includes(k)
        );

      const matchesCategory =
        activeCategory === 'All' ||
        (activeCategory === 'Specialized' && isSpecialized) ||
        (activeCategory === 'Domestic' &&
          (p.category === 'Domestic' ||
            p.destination.includes('India') ||
            p.slug.includes('kashmir') ||
            p.slug.includes('kerala') ||
            p.slug.includes('golden-triangle') ||
            p.slug.includes('andaman') ||
            p.slug.includes('goa'))) ||
        (activeCategory === 'International' &&
          (p.category === 'International' || (!p.category && p.kind === 'TOUR')));

      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

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

  const navigateToEnquiry = (params?: {
    service?: string;
    packageName?: string;
    country?: string;
    visaCategory?: string;
  }) => {
    (navigation.getParent?.() || navigation).navigate('Enquiry', params || {});
  };

  return (
    <View style={s.container}>
      {/* 1. Brand Header */}
      <BrandHeader
        subtitle="Services Hub &bull; Tours &amp; Visas"
        onContactPress={() => navigation.navigate('Contact')}
      />

      {/* 2. Top Service Switcher Segmented Pills */}
      <View style={s.switcherContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.switcherScroll}
        >
          <TouchableOpacity
            style={[s.switcherPill, activeTab === 'all' && s.switcherPillActive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.85}
          >
            <Ionicons
              name={activeTab === 'all' ? 'layers' : 'layers-outline'}
              size={15}
              color={activeTab === 'all' ? '#ffffff' : '#475569'}
              style={{ marginRight: 6 }}
            />
            <Text style={[s.switcherPillText, activeTab === 'all' && s.switcherPillTextActive]}>
              All Services
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.switcherPill, activeTab === 'packages' && s.switcherPillActive]}
            onPress={() => setActiveTab('packages')}
            activeOpacity={0.85}
          >
            <Ionicons
              name={activeTab === 'packages' ? 'airplane' : 'airplane-outline'}
              size={15}
              color={activeTab === 'packages' ? '#ffffff' : '#475569'}
              style={{ marginRight: 6 }}
            />
            <Text style={[s.switcherPillText, activeTab === 'packages' && s.switcherPillTextActive]}>
              Tour Packages
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.switcherPill, activeTab === 'visa' && s.switcherPillActive]}
            onPress={() => setActiveTab('visa')}
            activeOpacity={0.85}
          >
            <Ionicons
              name={activeTab === 'visa' ? 'document-text' : 'document-text-outline'}
              size={15}
              color={activeTab === 'visa' ? '#ffffff' : '#475569'}
              style={{ marginRight: 6 }}
            />
            <Text style={[s.switcherPillText, activeTab === 'visa' && s.switcherPillTextActive]}>
              Visa Services
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 3. Main Content Scroll Area */}
      <ScrollView
        style={s.mainScrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0284c7']} />}
      >
        {/* ========================================================================= */}
        {/* SECTION A: TOUR PACKAGES                                                  */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'packages') && (
          <View style={s.sectionWrap}>
            {/* Section Header */}
            <View style={s.sectionHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={s.eyebrowRow}>
                  <Ionicons name="airplane" size={13} color="#0284c7" style={{ marginRight: 5 }} />
                  <Text style={s.sectionEyebrow}>CURATED JOURNEYS &amp; HOLIDAYS</Text>
                </View>
                <Text style={s.sectionTitle}>Tour Packages &amp; Key Destinations</Text>
                <Text style={s.sectionSubtitle}>
                  Specialized keys (Reunion, Russia, Turkey, Mauritius, Maldives, Seychelles, Armenia, Georgia, Azerbaijan) &amp; global getaways.
                </Text>
              </View>
              {activeTab === 'all' && (
                <TouchableOpacity
                  onPress={() => setActiveTab('packages')}
                  style={s.focusLink}
                  activeOpacity={0.7}
                >
                  <Text style={s.focusLinkText}>Focus</Text>
                  <Ionicons name="arrow-forward" size={12} color="#0284c7" />
                </TouchableOpacity>
              )}
            </View>

            {/* Tour Packages Search Bar */}
            <View style={s.searchBar}>
              <Ionicons name="search-outline" size={16} color="#64748b" style={{ marginRight: 8 }} />
              <TextInput
                style={s.searchInput}
                placeholder="Search destinations (e.g. Kashmir, Maldives, Kerala)..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                  <Ionicons name="close-circle" size={18} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Category Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.categoryPillsScroll}
              style={{ marginBottom: 16 }}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[s.categoryPill, activeCategory === cat.id && s.categoryPillActive]}
                  onPress={() => setActiveCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={cat.icon}
                    size={13}
                    color={activeCategory === cat.id ? '#ffffff' : '#64748b'}
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={[
                      s.categoryPillText,
                      activeCategory === cat.id && s.categoryPillTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Offline Catalog Notice if API offline */}
            {isOffline && (
              <View style={s.offlineBanner}>
                <Ionicons name="cloud-offline-outline" size={13} color="#0ea5e9" style={{ marginRight: 6 }} />
                <Text style={s.offlineText}>Offline Catalog &bull; Showing verified travel itineraries</Text>
              </View>
            )}

            {/* Packages List */}
            {loading ? (
              <View style={s.centerBox}>
                <ActivityIndicator color={C.sky} size="large" />
                <Text style={s.loadingText}>Unfolding travel itineraries...</Text>
              </View>
            ) : error && filteredPackages.length === 0 ? (
              <View style={s.centerBox}>
                <Text style={s.empty}>{error}. Check your connection.</Text>
              </View>
            ) : filteredPackages.length === 0 ? (
              <View style={s.emptyCard}>
                <Ionicons name="search-outline" size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
                <Text style={s.emptyTitle}>No matching destinations found</Text>
                <Text style={s.emptySubtitle}>Try adjusting your search query or switching categories.</Text>
                <TouchableOpacity
                  style={s.resetBtn}
                  onPress={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                >
                  <Text style={s.resetBtnText}>View All Packages</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredPackages.map((item, idx) => {
                const isDomestic =
                  item.category === 'Domestic' ||
                  item.destination.includes('India') ||
                  item.slug.includes('kashmir') ||
                  item.slug.includes('kerala') ||
                  item.slug.includes('andaman');

                const isSpecialized =
                  item.category === 'Specialized' ||
                  ['reunion', 'russia', 'turkey', 'mauritius', 'maldives', 'seychelles', 'armenia', 'georgia', 'azerbaijan'].some(
                    (k) => item.slug?.toLowerCase().includes(k)
                  );

                const cardImage = getPackageImage(item.slug);

                return (
                  <View key={`${item.id || item.slug}-${idx}`} style={s.packageCard}>
                    {/* Visual Photography Header */}
                    <TouchableOpacity
                      activeOpacity={0.92}
                      onPress={() => navigateToPackage(item.slug)}
                      style={s.packageImageWrap}
                    >
                      <Image source={cardImage} style={s.packageImage} resizeMode="cover" />
                      <View style={s.imageOverlay} />

                      {/* Top Badges */}
                      <View style={s.cardTopRow}>
                        <View
                          style={[
                            s.badgePill,
                            isSpecialized
                              ? s.badgePillGold
                              : isDomestic
                              ? s.badgePillSky
                              : s.badgePillNavy,
                          ]}
                        >
                          <Ionicons
                            name={isSpecialized ? 'star' : isDomestic ? 'map' : 'airplane'}
                            size={10}
                            color="#ffffff"
                            style={{ marginRight: 4 }}
                          />
                          <Text style={s.badgePillText}>
                            {isSpecialized
                              ? 'SPECIALIZED'
                              : isDomestic
                              ? 'DOMESTIC'
                              : 'INTERNATIONAL'}
                          </Text>
                        </View>

                        <View style={s.ratingPill}>
                          <Ionicons name="star" size={11} color="#f59e0b" style={{ marginRight: 3 }} />
                          <Text style={s.ratingPillText}>4.9</Text>
                        </View>
                      </View>

                      {/* Bottom Duration Pill */}
                      <View style={s.cardBottomRow}>
                        <View style={s.durationPill}>
                          <Ionicons name="time-outline" size={12} color="#ffffff" style={{ marginRight: 4 }} />
                          <Text style={s.durationPillText}>{item.duration}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Card Body */}
                    <View style={s.packageBody}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigateToPackage(item.slug)}
                      >
                        <Text style={s.packageTitle}>{item.title}</Text>
                      </TouchableOpacity>

                      <View style={s.destinationRow}>
                        <Ionicons name="location-outline" size={13} color="#0ea5e9" style={{ marginRight: 4 }} />
                        <Text style={s.destinationText}>{item.destination}</Text>
                      </View>

                      <Text style={s.packageSummary} numberOfLines={2}>
                        {item.summary}
                      </Text>

                      {/* Highlights / Inclusions preview */}
                      {item.inclusions && item.inclusions.length > 0 && (
                        <View style={s.inclusionsRow}>
                          {item.inclusions.slice(0, 2).map((inc, i) => (
                            <View key={i} style={s.inclusionChip}>
                              <Ionicons name="checkmark-circle" size={11} color="#0284c7" style={{ marginRight: 4 }} />
                              <Text style={s.inclusionChipText} numberOfLines={1}>
                                {inc}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Action Footer */}
                      <View style={s.packageFooter}>
                        <View style={s.priceBox}>
                          <Text style={s.priceLabel}>CUSTOM QUOTE</Text>
                          <Text style={s.priceValue}>Price on Enquiry</Text>
                        </View>

                        <View style={s.actionBtnGroup}>
                          <TouchableOpacity
                            style={s.detailsBtn}
                            onPress={() => navigateToPackage(item.slug)}
                            activeOpacity={0.85}
                          >
                            <Text style={s.detailsBtnText}>Details</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={s.enquireBtn}
                            onPress={() =>
                              navigateToEnquiry({
                                service: 'tour',
                                packageName: item.title,
                              })
                            }
                            activeOpacity={0.85}
                          >
                            <Text style={s.enquireBtnText}>Enquire</Text>
                            <Ionicons name="arrow-forward" size={12} color="#ffffff" style={{ marginLeft: 3 }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* ========================================================================= */}
        {/* DIVIDER WHEN BOTH ARE SHOWN IN 'ALL' VIEW                                 */}
        {/* ========================================================================= */}
        {activeTab === 'all' && (
          <View style={s.sectionDividerWrap}>
            <View style={s.sectionDividerLine} />
            <View style={s.sectionDividerPill}>
              <Ionicons name="document-text" size={13} color="#0284c7" style={{ marginRight: 5 }} />
              <Text style={s.sectionDividerText}>INTERNATIONAL VISA CONCIERGE</Text>
            </View>
            <View style={s.sectionDividerLine} />
          </View>
        )}

        {/* ========================================================================= */}
        {/* SECTION B: INTERNATIONAL VISA SERVICES                                    */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'visa') && (
          <View style={s.sectionWrap}>
            {/* Section Header */}
            <View style={s.sectionHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={s.eyebrowRow}>
                  <Ionicons name="document-text" size={13} color="#0284c7" style={{ marginRight: 5 }} />
                  <Text style={s.sectionEyebrow}>OFFICIAL EMBASSY &amp; FAST-TRACK VISAS</Text>
                </View>
                <Text style={s.sectionTitle}>International Visa Services</Text>
                <Text style={s.sectionSubtitle}>
                  Arranged in visual cards just like our holiday packages. Choose from US B1/B2, UK Visitor, all 29 Schengen nations, Canada Visa, GCC Visas (Saudi, UAE, Oman, Kuwait, Qatar), and 50+ Global E-Visas.
                </Text>
              </View>
              {activeTab === 'all' && (
                <TouchableOpacity
                  onPress={() => setActiveTab('visa')}
                  style={s.focusLink}
                  activeOpacity={0.7}
                >
                  <Text style={s.focusLinkText}>Focus</Text>
                  <Ionicons name="arrow-forward" size={12} color="#0284c7" />
                </TouchableOpacity>
              )}
            </View>

            {/* Dedicated Visa Service Cards (US, UK, Schengen, Canada, GCC, E-Visa) */}
            {visas.map((v: VisaServiceItem) => {
              const isUS = v.slug === 'us-visa';
              const isUK = v.slug === 'uk-visa';
              const isSchengen = v.slug === 'schengen-visa';
              const isCanada = v.slug === 'canada-visa';
              const isGcc = v.slug === 'gcc-visa';
              const isEvisa = v.slug === 'e-visa';

              const visaImage = DESTINATION_IMAGES[v.imageKey] || DESTINATION_IMAGES['dubai-holiday'];

              return (
                <View key={v.id} style={s.visaCard}>
                  {/* Visual Header Image */}
                  <View style={s.visaImageWrap}>
                    <Image source={visaImage} style={s.visaImage} resizeMode="cover" />
                    <View style={s.imageOverlay} />

                    {/* Top Row Badges */}
                    <View style={s.cardTopRow}>
                      <View style={s.visaCategoryPill}>
                        <Text style={s.visaCategoryPillText}>{v.category.toUpperCase()}</Text>
                      </View>
                      <View style={s.visaBadgePill}>
                        <Ionicons name="shield-checkmark" size={11} color="#0284c7" style={{ marginRight: 4 }} />
                        <Text style={s.visaBadgePillText}>{v.badge}</Text>
                      </View>
                    </View>

                    {/* Bottom Title on Image */}
                    <View style={s.cardBottomRow}>
                      <Text style={s.visaHeroTitle}>{v.title}</Text>
                    </View>
                  </View>

                  {/* Visa Details Body */}
                  <View style={s.visaBody}>
                    {/* Key Specifications Grid */}
                    <View style={s.specsGrid}>
                      <View style={s.specItem}>
                        <Ionicons name="time-outline" size={13} color="#0284c7" />
                        <Text style={s.specLabel}>PROCESSING</Text>
                        <Text style={s.specValue} numberOfLines={1}>{v.processingTime}</Text>
                      </View>

                      <View style={s.specItem}>
                        <Ionicons name="calendar-outline" size={13} color="#0284c7" />
                        <Text style={s.specLabel}>VALIDITY</Text>
                        <Text style={s.specValue} numberOfLines={1}>{v.validity}</Text>
                      </View>

                      <View style={s.specItem}>
                        <Ionicons name="globe-outline" size={13} color="#0284c7" />
                        <Text style={s.specLabel}>ENTRY TYPE</Text>
                        <Text style={s.specValue} numberOfLines={1}>{v.entryType}</Text>
                      </View>
                    </View>

                    {/* Description */}
                    <Text style={s.visaDesc}>{v.shortDesc}</Text>

                    {/* Highlights List */}
                    <View style={s.highlightsBox}>
                      <Text style={s.highlightsHeader}>SERVICE INCLUSIONS &amp; ASSISTANCE:</Text>
                      {v.highlights.map((h, idx) => (
                        <View key={idx} style={s.highlightItem}>
                          <Ionicons name="checkmark-circle" size={14} color="#0284c7" style={{ marginRight: 6, marginTop: 1 }} />
                          <Text style={s.highlightText}>{h}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Accordion 1: Schengen 29 Member Nations */}
                    {isSchengen && (
                      <View style={s.accordionWrap}>
                        <TouchableOpacity
                          style={s.accordionToggle}
                          onPress={() => setShowSchengenList(!showSchengenList)}
                          activeOpacity={0.8}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="earth" size={14} color="#0284c7" style={{ marginRight: 6 }} />
                            <Text style={s.accordionTitle}>
                              View All 29 Schengen Member Countries ({SCHENGEN_MEMBER_COUNTRIES.length})
                            </Text>
                          </View>
                          <Ionicons
                            name={showSchengenList ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color="#64748b"
                          />
                        </TouchableOpacity>

                        {showSchengenList && (
                          <View style={s.countriesGrid}>
                            <Text style={s.countriesExplainer}>
                              Tapping any country pre-selects it for your visa consultation:
                            </Text>
                            <View style={s.countriesPillsContainer}>
                              {SCHENGEN_MEMBER_COUNTRIES.map((c) => (
                                <TouchableOpacity
                                  key={c}
                                  style={s.countryPill}
                                  onPress={() =>
                                    navigateToEnquiry({
                                      service: 'visa',
                                      country: c,
                                      visaCategory: 'schengen',
                                    })
                                  }
                                  activeOpacity={0.7}
                                >
                                  <Text style={s.countryPillText}>{c}</Text>
                                  <Ionicons name="arrow-forward" size={10} color="#0284c7" style={{ marginLeft: 3 }} />
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Accordion 2: GCC Countries & Resident Scheme */}
                    {isGcc && (
                      <View style={s.accordionWrap}>
                        <TouchableOpacity
                          style={s.accordionToggle}
                          onPress={() => setShowGccList(!showGccList)}
                          activeOpacity={0.8}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="sunny" size={14} color="#0284c7" style={{ marginRight: 6 }} />
                            <Text style={s.accordionTitle}>
                              GCC Countries &amp; Resident Option ({GCC_COUNTRIES.length})
                            </Text>
                          </View>
                          <Ionicons
                            name={showGccList ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color="#64748b"
                          />
                        </TouchableOpacity>

                        {showGccList && (
                          <View style={s.countriesGrid}>
                            <Text style={s.countriesExplainer}>
                              Single/Multiple Entry &amp; GCC Resident Visa option for Iqama holders:
                            </Text>
                            <View style={s.countriesPillsContainer}>
                              {GCC_COUNTRIES.map((c) => (
                                <TouchableOpacity
                                  key={c}
                                  style={s.countryPill}
                                  onPress={() =>
                                    navigateToEnquiry({
                                      service: 'visa',
                                      country: c,
                                      visaCategory: 'gcc',
                                    })
                                  }
                                  activeOpacity={0.7}
                                >
                                  <Text style={s.countryPillText}>{c}</Text>
                                  <Ionicons name="arrow-forward" size={10} color="#0284c7" style={{ marginLeft: 3 }} />
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Accordion 3: Global E-Visa Countries */}
                    {isEvisa && (
                      <View style={s.accordionWrap}>
                        <TouchableOpacity
                          style={s.accordionToggle}
                          onPress={() => setShowEvisaList(!showEvisaList)}
                          activeOpacity={0.8}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="flash-outline" size={14} color="#0284c7" style={{ marginRight: 6 }} />
                            <Text style={s.accordionTitle}>
                              Popular Fast-Track E-Visa Destinations ({POPULAR_EVISA_COUNTRIES.length}+)
                            </Text>
                          </View>
                          <Ionicons
                            name={showEvisaList ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color="#64748b"
                          />
                        </TouchableOpacity>

                        {showEvisaList && (
                          <View style={s.countriesGrid}>
                            <Text style={s.countriesExplainer}>
                              Fast 24-72h approvals. Tap any country to enquire immediately:
                            </Text>
                            <View style={s.countriesPillsContainer}>
                              {POPULAR_EVISA_COUNTRIES.map((c) => (
                                <TouchableOpacity
                                  key={c}
                                  style={s.countryPill}
                                  onPress={() =>
                                    navigateToEnquiry({
                                      service: 'visa',
                                      country: c,
                                      visaCategory: 'evisa',
                                    })
                                  }
                                  activeOpacity={0.7}
                                >
                                  <Text style={s.countryPillText}>{c}</Text>
                                  <Ionicons name="arrow-forward" size={10} color="#0284c7" style={{ marginLeft: 3 }} />
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Visa Enquire Primary Action Button */}
                    <TouchableOpacity
                      style={s.visaPrimaryBtn}
                      onPress={() => {
                        let country =
                          v.defaultCountry ||
                          (isSchengen ? 'France' : isGcc ? 'Saudi Arabia' : isCanada ? 'Canada' : 'United Arab Emirates');
                        let visaCategory = isUS
                          ? 'us'
                          : isUK
                          ? 'uk'
                          : isSchengen
                          ? 'schengen'
                          : isCanada
                          ? 'canada'
                          : isGcc
                          ? 'gcc'
                          : 'evisa';
                        navigateToEnquiry({
                          service: 'visa',
                          country,
                          visaCategory,
                        });
                      }}
                      activeOpacity={0.88}
                    >
                      <Ionicons name="document-text" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                      <Text style={s.visaPrimaryBtnText}>Enquire for {v.title}</Text>
                      <Ionicons name="arrow-forward" size={14} color="#ffffff" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ========================================================================= */}
        {/* SECTION C: SERVICE ASSURANCE GUARANTEE (THE SKYRAY WAY)                   */}
        {/* ========================================================================= */}
        <View style={s.assuranceCard}>
          <Text style={s.assuranceEyebrow}>THE SKYRAY ASSURANCE</Text>
          <Text style={s.assuranceTitle}>Travel with Complete Confidence</Text>

          <View style={{ gap: 10 }}>
            <View style={s.assuranceRow}>
              <View style={s.assuranceCell}>
                <View style={[s.assuranceIconCircle, { backgroundColor: '#e0f2fe' }]}>
                  <Ionicons name="ribbon-outline" size={18} color="#0284c7" />
                </View>
                <Text style={s.assuranceCellTitle}>Transparent Pricing</Text>
                <Text style={s.assuranceCellBody}>Clear inclusions, upfront fees &amp; zero hidden charges.</Text>
              </View>

              <View style={s.assuranceCell}>
                <View style={[s.assuranceIconCircle, { backgroundColor: '#e0f2fe' }]}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#0284c7" />
                </View>
                <Text style={s.assuranceCellTitle}>99% Audit Accuracy</Text>
                <Text style={s.assuranceCellBody}>Pre-screening verification for maximum approval confidence.</Text>
              </View>
            </View>

            <View style={s.assuranceRow}>
              <View style={s.assuranceCell}>
                <View style={[s.assuranceIconCircle, { backgroundColor: '#e0f2fe' }]}>
                  <Ionicons name="time-outline" size={18} color="#0284c7" />
                </View>
                <Text style={s.assuranceCellTitle}>Fast Response Desk</Text>
                <Text style={s.assuranceCellBody}>Direct assistance via WhatsApp, phone &amp; email support.</Text>
              </View>

              <View style={s.assuranceCell}>
                <View style={[s.assuranceIconCircle, { backgroundColor: '#e0f2fe' }]}>
                  <Ionicons name="sparkles-outline" size={18} color="#0284c7" />
                </View>
                <Text style={s.assuranceCellTitle}>Customized For You</Text>
                <Text style={s.assuranceCellBody}>Tailored private or group packages designed to your pace.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* SECTION D: READY TO PLAN CONCIERGE BANNER                                 */}
        {/* ========================================================================= */}
        <View style={s.ctaBanner}>
          <View style={s.ctaBadge}>
            <Ionicons name="chatbubbles" size={12} color="#38bdf8" style={{ marginRight: 5 }} />
            <Text style={s.ctaBadgeText}>EXPERT TRAVEL CONCIERGE</Text>
          </View>
          <Text style={s.ctaTitle}>Need Guidance on a Tour or Visa?</Text>
          <Text style={s.ctaSubtitle}>
            Tell us about your destination or visa query. Our concierge desk will prepare a tailored itinerary or checklist within hours.
          </Text>

          <TouchableOpacity
            style={s.ctaGoldBtn}
            onPress={() => navigateToEnquiry()}
            activeOpacity={0.88}
          >
            <Text style={s.ctaGoldBtnText}>Start an Enquiry</Text>
            <Ionicons name="arrow-forward" size={14} color="#0f2942" />
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
  switcherContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  switcherScroll: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  switcherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  switcherPillActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  switcherPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  switcherPillTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionWrap: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  sectionEyebrow: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0284c7',
    letterSpacing: 0.8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0f2942',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: '#64748b',
    lineHeight: 17,
  },
  focusLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    marginTop: 2,
  },
  focusLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284c7',
    marginRight: 3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: C.deep,
    paddingVertical: 0,
    fontWeight: '500',
  },
  categoryPillsScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryPillActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0284c7',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748b',
  },
  categoryPillTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  offlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: C.muted,
    fontSize: 13,
  },
  empty: {
    color: C.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f2942',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 14,
  },
  resetBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  // Package Card Styles
  packageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2edf3',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  packageImageWrap: {
    width: '100%',
    height: 175,
    backgroundColor: '#0f172a',
    position: 'relative',
    overflow: 'hidden',
  },
  packageImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
  },
  cardTopRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgePillSky: {
    backgroundColor: 'rgba(2, 132, 199, 0.92)',
  },
  badgePillGold: {
    backgroundColor: 'rgba(217, 119, 6, 0.95)',
  },
  badgePillNavy: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
  },
  badgePillText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 10,
  },
  ratingPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  cardBottomRow: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 2,
  },
  durationPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  durationPillText: {
    color: '#ffffff',
    fontSize: 10.5,
    fontWeight: '700',
  },
  packageBody: {
    padding: 14,
  },
  packageTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0f2942',
    lineHeight: 21,
    marginBottom: 4,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  destinationText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  packageSummary: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 10,
  },
  inclusionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  inclusionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  inclusionChipText: {
    fontSize: 10.5,
    color: '#0369a1',
    fontWeight: '600',
  },
  packageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  priceBox: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 9,
    color: '#0284c7',
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f2942',
    marginTop: 1,
  },
  actionBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailsBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  detailsBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  enquireBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 8,
    backgroundColor: '#0284c7',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  enquireBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#ffffff',
  },

  // Section Divider Styles
  sectionDividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  sectionDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  sectionDividerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    marginHorizontal: 10,
  },
  sectionDividerText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0284c7',
    letterSpacing: 0.8,
  },

  // Visa Card Styles
  visaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2edf3',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  visaImageWrap: {
    width: '100%',
    height: 175,
    backgroundColor: '#0f172a',
    position: 'relative',
    overflow: 'hidden',
  },
  visaImage: {
    width: '100%',
    height: '100%',
  },
  visaCategoryPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  visaCategoryPillText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  visaBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  visaBadgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0f2942',
  },
  visaHeroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  visaBody: {
    padding: 15,
  },
  specsGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'space-between',
  },
  specItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  specLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.6,
    marginTop: 3,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f2942',
    textAlign: 'center',
  },
  visaDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 12,
  },
  highlightsBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  highlightsHeader: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0284c7',
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  highlightText: {
    flex: 1,
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
    fontWeight: '500',
  },
  accordionWrap: {
    marginBottom: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  accordionToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
  },
  accordionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0f2942',
  },
  countriesGrid: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  countriesExplainer: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  countriesPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  countryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  countryPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0369a1',
  },
  visaPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 3,
  },
  visaPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Service Assurance Styles
  assuranceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2edf3',
    marginBottom: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  assuranceEyebrow: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0284c7',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  assuranceTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f2942',
    letterSpacing: -0.2,
    marginBottom: 14,
  },
  assuranceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  assuranceCell: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  assuranceIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  assuranceCellTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f2942',
    marginBottom: 3,
  },
  assuranceCellBody: {
    fontSize: 10.5,
    color: '#64748b',
    lineHeight: 14,
  },

  // CTA Banner Styles
  ctaBanner: {
    backgroundColor: '#17496B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
  },
  ctaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  ctaBadgeText: {
    color: '#38bdf8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  ctaSubtitle: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 17,
    marginBottom: 14,
  },
  ctaGoldBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaGoldBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0f2942',
    marginRight: 6,
  },
});

