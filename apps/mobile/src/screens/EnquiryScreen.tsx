import React, { useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { sendEnquiry } from '../lib/api';
import { C, PrimaryButton, BrandHeader } from '../components/UI';
import { Ionicons } from '@expo/vector-icons';
import { ORDERED_COUNTRIES } from '../lib/countries';

const SCHENGEN_COUNTRIES = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Czech Republic', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
  'Iceland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania',
  'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland'
];

const EVISA_COUNTRIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Singapore', 'Malaysia',
  'Thailand', 'Sri Lanka', 'Turkey', 'Egypt', 'Vietnam',
  'Indonesia', 'Georgia', 'Azerbaijan', 'Armenia', 'Russia',
  'Oman', 'Qatar', 'Bahrain', 'Kuwait', 'Kenya', 'Australia'
];

type ServiceType = 'tour' | 'umrah' | 'visa';

export function EnquiryScreen({ route, navigation }: any) {
  const idempotencyKey = useRef<string | null>(null);

  const initialService: ServiceType =
    route.params?.service === 'visa' || route.params?.visaCategory
      ? 'visa'
      : route.params?.service === 'umrah' || route.params?.packageName?.toLowerCase().includes('umrah')
      ? 'umrah'
      : 'tour';

  const [data, setData] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceType: initialService,
    // Travelers breakdown
    adults: '2',
    children: '0',
    infants: '0',
    // Visa
    visaCountry: route.params?.country || 'United States',
    visaType: 'Tourist Visa' as 'Tourist Visa' | 'Business Visa' | 'Medical Visa',
    // Tour
    tourCountry: route.params?.packageName || 'Reunion Island',
    tourType: 'Private Tour' as 'Private Tour' | 'Group Tour',
    nights: '5',
    // Umrah
    umrahTier: 'economy',
    // Common
    preferredDate: '',
    instructions: '',
    consent: true,
  });

  const [busy, setBusy] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const set = (k: string, v: any) => {
    idempotencyKey.current = null;
    setData((x) => ({ ...x, [k]: v }));
  };

  async function submit() {
    if (busy) return;
    if (!data.fullName.trim() || !data.phone.trim() || !data.preferredDate.trim()) {
      Alert.alert('Missing Details', 'Please enter your Full Name, Contact Number / WhatsApp, and Preferred Date.');
      return;
    }

    setBusy(true);
    try {
      const key = (idempotencyKey.current ||= `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      const numAdults = Number(data.adults) || 1;
      const numChildren = Number(data.children) || 0;
      const numInfants = Number(data.infants) || 0;
      const totalMembers = numAdults + numChildren + numInfants;

      let serviceLabel = '';
      let targetCountry = '';
      if (data.serviceType === 'visa') {
        serviceLabel = `Visa: ${data.visaCountry} (${data.visaType})`;
        targetCountry = data.visaCountry;
      } else if (data.serviceType === 'tour') {
        serviceLabel = `Tour: ${data.tourCountry} (${data.tourType})`;
        targetCountry = data.tourCountry;
      } else {
        serviceLabel = `Umrah Enquiry (${data.umrahTier.toUpperCase()} Tier)`;
        targetCountry = 'Saudi Arabia';
      }

      const res = await sendEnquiry(
        {
          fullName: data.fullName.trim(),
          phone: data.phone.trim(),
          email: data.email.trim() || 'traveller@example.com',
          members: totalMembers,
          adults: numAdults,
          children: numChildren,
          kids: numChildren,
          infants: numInfants,
          serviceType: data.serviceType,
          visaType: data.serviceType === 'visa' ? data.visaType : undefined,
          tourType: data.serviceType === 'tour' ? data.tourType : undefined,
          tier: data.serviceType === 'umrah' ? data.umrahTier : undefined,
          country: targetCountry,
          packageName: serviceLabel,
          preferredDate: data.preferredDate,
          days: Number(data.nights) || 5,
          nights: Number(data.nights) || 5,
          instructions: data.instructions,
          consent: true,
          sourcePlatform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
        },
        key,
      );

      const ref = res?.reference || `SRH${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
      idempotencyKey.current = null;

      Alert.alert(
        'Enquiry Received!',
        `Thank you ${data.fullName}! Your enquiry reference is ${ref}.\n\nService: ${serviceLabel}\nTravelers: ${numAdults} Adults, ${numChildren} Children, ${numInfants} Infants.\n\nWould you like to forward these details to our WhatsApp desk for instant assistance?`,
        [
          {
            text: 'Forward to WhatsApp',
            onPress: () => {
              const text = encodeURIComponent(
                `Hello SkyRay Holidays! I just submitted an enquiry on the mobile app.\n` +
                `• Reference: ${ref}\n` +
                `• Name: ${data.fullName}\n` +
                `• Phone/WhatsApp: ${data.phone}\n` +
                `• Service: ${serviceLabel}\n` +
                `• Date: ${data.preferredDate}\n` +
                `• Travelers: ${numAdults} Adults (12+ yrs), ${numChildren} Children (<12 yrs), ${numInfants} Infants (0-2 yrs)\n` +
                (data.instructions ? `• Notes: ${data.instructions}\n` : '') +
                `Please provide quotation and itinerary details.`
              );
              Linking.openURL(`https://wa.me/919176357791?text=${text}`).catch(() => {});
              navigation.goBack();
            },
          },
          { text: 'Done', style: 'cancel', onPress: () => navigation.goBack() },
        ],
      );
    } catch (err: any) {
      Alert.alert('Submission Error', err.message || 'Unable to submit enquiry. Please check connection.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <BrandHeader subtitle="Tour packages, Umrah, and Global Visa services" />

      <View style={s.card}>
        {/* Full Name */}
        <View style={s.field}>
          <Text style={s.label}>Full Name *</Text>
          <TextInput
            style={s.input}
            value={data.fullName}
            onChangeText={(v) => set('fullName', v)}
            placeholder="e.g. Syed Rahamathullah"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Email Address */}
        <View style={s.field}>
          <Text style={s.label}>Email Address *</Text>
          <TextInput
            style={s.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={data.email}
            onChangeText={(v) => set('email', v)}
            placeholder="you@example.com"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Contact Number / WhatsApp */}
        <View style={s.field}>
          <Text style={s.label}>Contact Number / WhatsApp *</Text>
          <TextInput
            style={s.input}
            keyboardType="phone-pad"
            value={data.phone}
            onChangeText={(v) => set('phone', v)}
            placeholder="+91 91763 57791"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Number of Members Breakdown */}
        <View style={s.field}>
          <Text style={[s.label, { color: '#0284c7' }]}>NUMBER OF MEMBERS</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.subLabel}>Adult (12+ yrs) *</Text>
              <TextInput
                style={s.input}
                keyboardType="number-pad"
                value={data.adults}
                onChangeText={(v) => set('adults', v)}
                placeholder="2"
                placeholderTextColor="#94a3b8"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.subLabel}>Child (&lt;12 yrs)</Text>
              <TextInput
                style={s.input}
                keyboardType="number-pad"
                value={data.children}
                onChangeText={(v) => set('children', v)}
                placeholder="0"
                placeholderTextColor="#94a3b8"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.subLabel}>Infant (0-2 yrs)</Text>
              <TextInput
                style={s.input}
                keyboardType="number-pad"
                value={data.infants}
                onChangeText={(v) => set('infants', v)}
                placeholder="0"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        </View>

        {/* Select Service (Umrah, Tour, Visa) */}
        <View style={s.field}>
          <Text style={[s.label, { color: '#17496b' }]}>SELECT SERVICE *</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {(['tour', 'umrah', 'visa'] as ServiceType[]).map((st) => {
              const active = data.serviceType === st;
              const labels = {
                tour: 'Tour Package',
                umrah: 'Umrah Enquiry',
                visa: 'Visa Enquiry',
              };
              return (
                <TouchableOpacity
                  key={st}
                  style={[s.serviceBtn, active && s.serviceBtnActive]}
                  onPress={() => set('serviceType', st)}
                >
                  <Text style={[s.serviceBtnText, active && s.serviceBtnTextActive]}>
                    {labels[st]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CONDITIONAL SECTION: VISA ENQUIRY */}
        {data.serviceType === 'visa' && (
          <View style={s.conditionalBox}>
            <Text style={s.sectionTitle}>VISA SPECIFIC DETAILS</Text>

            {/* Country for Visa */}
            <View style={s.field}>
              <Text style={s.label}>Country for Visa *</Text>
              <TouchableOpacity
                style={[s.input, s.pickerBtn]}
                onPress={() => setShowCountryPicker(!showCountryPicker)}
              >
                <Text style={s.pickerText} numberOfLines={1}>{data.visaCountry}</Text>
                <Ionicons name={showCountryPicker ? 'chevron-up' : 'chevron-down'} size={18} color="#64748b" />
              </TouchableOpacity>

              {showCountryPicker && (
                <View style={s.dropdownList}>
                  <TextInput
                    style={[s.input, { margin: 6, paddingVertical: 6, fontSize: 13, backgroundColor: '#f1f5f9' }]}
                    placeholder="🔍 Search country (US, UK, Schengen...)"
                    placeholderTextColor="#94a3b8"
                    value={countrySearch}
                    onChangeText={setCountrySearch}
                    autoCapitalize="none"
                  />
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                    {['United States', 'United Kingdom', ...SCHENGEN_COUNTRIES.map((c) => `${c} (Schengen)`), ...EVISA_COUNTRIES.map((c) => `${c} (E-Visa)`), ...ORDERED_COUNTRIES]
                      .filter((c, i, arr) => arr.indexOf(c) === i)
                      .filter((c) => !countrySearch || c.toLowerCase().includes(countrySearch.toLowerCase()))
                      .map((c) => (
                        <TouchableOpacity
                          key={c}
                          style={[s.dropdownItem, c === data.visaCountry && s.dropdownItemActive]}
                          onPress={() => {
                            set('visaCountry', c);
                            setShowCountryPicker(false);
                            setCountrySearch('');
                          }}
                        >
                          <Text style={[s.dropdownText, c === data.visaCountry && s.dropdownTextActive]}>{c}</Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Type of Visa: ONLY Tourist, Business, Medical */}
            <View style={s.field}>
              <Text style={s.label}>Type of Visa * (Tourist, Business, Medical Only)</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {(['Tourist Visa', 'Business Visa', 'Medical Visa'] as const).map((vt) => {
                  const active = data.visaType === vt;
                  return (
                    <TouchableOpacity
                      key={vt}
                      style={[s.optionChip, active && s.optionChipActive]}
                      onPress={() => set('visaType', vt)}
                    >
                      <Text style={[s.optionChipText, active && s.optionChipTextActive]}>{vt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Expected Date of Travel */}
            <View style={s.field}>
              <Text style={s.label}>Expected Date of Travel *</Text>
              <TextInput
                style={s.input}
                value={data.preferredDate}
                onChangeText={(v) => set('preferredDate', v)}
                placeholder="e.g. YYYY-MM-DD or Month 2026"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        )}

        {/* CONDITIONAL SECTION: TOUR PACKAGE ENQUIRY */}
        {data.serviceType === 'tour' && (
          <View style={s.conditionalBox}>
            <Text style={s.sectionTitle}>TOUR PACKAGE DETAILS</Text>

            {/* Select Destination / Country */}
            <View style={s.field}>
              <Text style={s.label}>Select Destination / Country *</Text>
              <TouchableOpacity
                style={[s.input, s.pickerBtn]}
                onPress={() => setShowCountryPicker(!showCountryPicker)}
              >
                <Text style={s.pickerText} numberOfLines={1}>{data.tourCountry}</Text>
                <Ionicons name={showCountryPicker ? 'chevron-up' : 'chevron-down'} size={18} color="#64748b" />
              </TouchableOpacity>

              {showCountryPicker && (
                <View style={s.dropdownList}>
                  <TextInput
                    style={[s.input, { margin: 6, paddingVertical: 6, fontSize: 13, backgroundColor: '#f1f5f9' }]}
                    placeholder="🔍 Search international countries..."
                    placeholderTextColor="#94a3b8"
                    value={countrySearch}
                    onChangeText={setCountrySearch}
                    autoCapitalize="none"
                  />
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                    {['Reunion Island', 'Russia', 'Turkey', 'Mauritius', 'Maldives', 'Seychelles', 'Armenia', 'Georgia', 'Azerbaijan', ...ORDERED_COUNTRIES]
                      .filter((c, i, arr) => arr.indexOf(c) === i)
                      .filter((c) => !countrySearch || c.toLowerCase().includes(countrySearch.toLowerCase()))
                      .map((c) => (
                        <TouchableOpacity
                          key={c}
                          style={[s.dropdownItem, c === data.tourCountry && s.dropdownItemActive]}
                          onPress={() => {
                            set('tourCountry', c);
                            setShowCountryPicker(false);
                            setCountrySearch('');
                          }}
                        >
                          <Text style={[s.dropdownText, c === data.tourCountry && s.dropdownTextActive]}>{c}</Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Preferred Date of Travel */}
            <View style={s.field}>
              <Text style={s.label}>Preferred Date of Travel *</Text>
              <TextInput
                style={s.input}
                value={data.preferredDate}
                onChangeText={(v) => set('preferredDate', v)}
                placeholder="e.g. YYYY-MM-DD or Month 2026"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Number of Nights */}
            <View style={s.field}>
              <Text style={s.label}>Number of Nights (Traveling Days) *</Text>
              <TextInput
                style={s.input}
                keyboardType="number-pad"
                value={data.nights}
                onChangeText={(v) => set('nights', v)}
                placeholder="e.g. 5"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Tour Type Option (Private or Group) */}
            <View style={s.field}>
              <Text style={s.label}>Tour Package Option *</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {(['Private Tour', 'Group Tour'] as const).map((mode) => {
                  const active = data.tourType === mode;
                  return (
                    <TouchableOpacity
                      key={mode}
                      style={[s.optionChip, { flex: 1 }, active && s.optionChipActive]}
                      onPress={() => set('tourType', mode)}
                    >
                      <Text style={[s.optionChipText, active && s.optionChipTextActive]}>{mode}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* CONDITIONAL SECTION: UMRAH ENQUIRY */}
        {data.serviceType === 'umrah' && (
          <View style={s.conditionalBox}>
            <Text style={s.sectionTitle}>UMRAH PILGRIMAGE DETAILS</Text>

            <View style={s.field}>
              <Text style={s.label}>Umrah Package Tier *</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={[s.optionChip, { flex: 1 }, data.umrahTier === 'economy' && s.optionChipActive]}
                  onPress={() => set('umrahTier', 'economy')}
                >
                  <Text style={[s.optionChipText, data.umrahTier === 'economy' && s.optionChipTextActive]}>
                    Economy (Comfort)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.optionChip, { flex: 1 }, data.umrahTier === 'premium' && s.optionChipActive]}
                  onPress={() => set('umrahTier', 'premium')}
                >
                  <Text style={[s.optionChipText, data.umrahTier === 'premium' && s.optionChipTextActive]}>
                    ★ Premium (5-Star VIP)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>Preferred Travel Date *</Text>
              <TextInput
                style={s.input}
                value={data.preferredDate}
                onChangeText={(v) => set('preferredDate', v)}
                placeholder="e.g. Ramadan 2026 or DD/MM/YYYY"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={s.field}>
              <Text style={s.label}>Duration (Days / Nights) *</Text>
              <TextInput
                style={s.input}
                keyboardType="number-pad"
                value={data.nights}
                onChangeText={(v) => set('nights', v)}
                placeholder="e.g. 15"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        )}

        {/* Additional Notes / Requirements */}
        <View style={s.field}>
          <Text style={s.label}>Additional Notes / Requirements</Text>
          <TextInput
            style={[s.input, s.textArea]}
            multiline
            numberOfLines={3}
            value={data.instructions}
            onChangeText={(v) => set('instructions', v)}
            placeholder="Room preferences, flight departure city, dietary requests..."
            placeholderTextColor="#94a3b8"
          />
        </View>

        <PrimaryButton
          title={busy ? 'Submitting Enquiry...' : 'Submit Enquiry ↗'}
          onPress={submit}
        />

        <Text style={s.disclaimer}>
          🔒 Official booking enquiry. Availability, visa rules and quotes are confirmed directly by our concierge.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2edf3',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  field: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '800', color: '#17496b', marginBottom: 6, letterSpacing: 0.3 },
  subLabel: { fontSize: 10.5, fontWeight: '700', color: '#64748b', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
  },
  pickerText: { fontSize: 13.5, fontWeight: '700', color: '#0f172a', flex: 1 },
  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemActive: { backgroundColor: '#e0f2fe' },
  dropdownText: { fontSize: 13, color: '#334155' },
  dropdownTextActive: { color: '#0284c7', fontWeight: '800' },
  serviceBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceBtnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  serviceBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  serviceBtnTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  conditionalBox: {
    backgroundColor: '#f8fbfe',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0284c7',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  optionChip: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionChipActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  optionChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  optionChipTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  textArea: { minHeight: 70, textAlignVertical: 'top' },
  disclaimer: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
});
