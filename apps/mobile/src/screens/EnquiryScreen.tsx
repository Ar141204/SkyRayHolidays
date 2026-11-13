import React, { useRef, useState, useEffect } from 'react';
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
  Modal,
  ActivityIndicator,
} from 'react-native';
import { sendEnquiry, generateRandomMobileReference } from '../lib/api';
import { C, PrimaryButton, BrandHeader } from '../components/UI';
import { Ionicons } from '@expo/vector-icons';
import { ORDERED_COUNTRIES } from '../lib/countries';
import {
  GCC_COUNTRIES,
  SCHENGEN_MEMBER_COUNTRIES as SCHENGEN_COUNTRIES,
  POPULAR_EVISA_COUNTRIES as EVISA_COUNTRIES,
} from '../lib/visas';

type MainCategory = 'tour' | 'hajj-umrah' | 'visa';
type VisaCategory = 'us' | 'uk' | 'schengen' | 'canada' | 'gcc' | 'evisa';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const iso = normalizeDateToISO(dateStr);
  const parts = iso.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return `${d} ${MONTH_SHORT[m]} ${y}`;
    }
  }
  return dateStr;
}

function normalizeDateToISO(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const parts = trimmed.split(/[/.-]/);
  if (parts.length === 3) {
    const p0 = parseInt(parts[0], 10);
    const p1 = parseInt(parts[1], 10);
    const p2 = parseInt(parts[2], 10);
    if (p2 > 1000) {
      const year = p2;
      let month = p1;
      let day = p0;
      if (p0 > 12 && p1 <= 12) {
        day = p0;
        month = p1;
      }
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return trimmed;
}

type FormErrors = Partial<Record<'fullName' | 'phone' | 'date' | 'general', string>>;

export function EnquiryScreen({ route, navigation }: any) {
  const idempotencyKey = useRef<string | null>(null);
  const scrollRef = useRef<any>(null);

  const resolveInitialVisa = (): VisaCategory => {
    const vc = route.params?.visaCategory;
    const country = route.params?.country || '';
    if (vc === 'canada' || country === 'Canada') return 'canada';
    if (vc === 'gcc' || GCC_COUNTRIES.includes(country)) return 'gcc';
    if (vc === 'uk' || country === 'United Kingdom') return 'uk';
    if (vc === 'schengen' || SCHENGEN_COUNTRIES.includes(country)) return 'schengen';
    if (vc === 'evisa' || EVISA_COUNTRIES.includes(country)) return 'evisa';
    return 'us';
  };

  const initialCat: MainCategory =
    route.params?.service === 'visa' || route.params?.visaCategory
      ? 'visa'
      : route.params?.service === 'umrah' ||
        route.params?.service === 'hajj' ||
        route.params?.packageName?.toLowerCase().includes('umrah') ||
        route.params?.packageName?.toLowerCase().includes('hajj')
      ? 'hajj-umrah'
      : 'tour';

  const [mainCat, setMainCat] = useState<MainCategory>(initialCat);
  const [visaSubCat, setVisaSubCat] = useState<VisaCategory>(resolveInitialVisa());

  // Customer Contact Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [instructions, setInstructions] = useState('');

  // Date Picker & Calendar State
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date(Date.now() + 14 * 86400000);
    return d.toISOString().slice(0, 10);
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calDate, setCalDate] = useState(() => {
    const d = new Date(Date.now() + 14 * 86400000);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [tempSelectedIso, setTempSelectedIso] = useState(preferredDate);

  // Form Validation & Success State
  const [formError, setFormError] = useState<FormErrors>({});
  const [submissionSuccess, setSubmissionSuccess] = useState<any>(null);

  // Travelers breakdown
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [infants, setInfants] = useState('0');

  // Tour Specific
  const [tourCountry, setTourCountry] = useState(route.params?.packageName || 'Custom Holiday');
  const [tourType, setTourType] = useState<'Private Tour' | 'Group Tour'>('Private Tour');
  const [nights, setNights] = useState('5');

  // Hajj & Umrah Specific
  const [pilgrimType, setPilgrimType] = useState<'UMRAH' | 'HAJJ'>(
    route.params?.service === 'hajj' || route.params?.packageName?.toLowerCase().includes('hajj')
      ? 'HAJJ'
      : 'UMRAH'
  );
  const [pilgrimTier, setPilgrimTier] = useState<'premium' | 'economy'>('premium');
  const [roomSharing, setRoomSharing] = useState('Quad Sharing (4/Room)');

  // USA Visa Specific
  const [usVisaType, setUsVisaType] = useState('Tourist & Business (B1/B2)');
  const [usEntry, setUsEntry] = useState('10-Year Multiple Entry');

  // UK Visa Specific
  const [ukVisaType, setUkVisaType] = useState('Tourist Visa');
  const [ukValidity, setUkValidity] = useState('6 Months Standard');

  // Schengen Visa Specific
  const [schengenCountry, setSchengenCountry] = useState(
    SCHENGEN_COUNTRIES.includes(route.params?.country) ? route.params.country : 'France'
  );
  const [schengenVisaType, setSchengenVisaType] = useState('Tourist Visa');
  const [schengenEntry, setSchengenEntry] = useState('Multiple Entry');

  // Canada Visa Specific
  const [canadaVisaType, setCanadaVisaType] = useState('Tourist (V1)');
  const [canadaBiometrics, setCanadaBiometrics] = useState('Need New VFS Biometrics');

  // GCC Visa Specific
  const [gccCountry, setGccCountry] = useState(
    GCC_COUNTRIES.includes(route.params?.country) ? route.params.country : 'Saudi Arabia'
  );
  const [gccVisaType, setGccVisaType] = useState('Standard Tourist eVisa');
  const [gccEntry, setGccEntry] = useState('Single Entry');
  const [gccResidentOption, setGccResidentOption] = useState(true);

  // E-Visa Specific
  const [evisaCountry, setEvisaCountry] = useState(
    EVISA_COUNTRIES.includes(route.params?.country) ? route.params.country : 'Malaysia'
  );
  const [evisaPurpose, setEvisaPurpose] = useState('Tourism & Leisure');

  useEffect(() => {
    if (route.params) {
      if (route.params.service === 'visa' || route.params.visaCategory) {
        setMainCat('visa');
        setVisaSubCat(resolveInitialVisa());
        if (route.params.country) {
          if (GCC_COUNTRIES.includes(route.params.country)) {
            setGccCountry(route.params.country);
          } else if (SCHENGEN_COUNTRIES.includes(route.params.country)) {
            setSchengenCountry(route.params.country);
          } else if (EVISA_COUNTRIES.includes(route.params.country)) {
            setEvisaCountry(route.params.country);
          }
        }
      } else if (
        route.params.service === 'umrah' ||
        route.params.service === 'hajj' ||
        route.params.packageName?.toLowerCase().includes('umrah') ||
        route.params.packageName?.toLowerCase().includes('hajj')
      ) {
        setMainCat('hajj-umrah');
        if (route.params.packageName?.toLowerCase().includes('hajj') || route.params.service === 'hajj') {
          setPilgrimType('HAJJ');
        } else {
          setPilgrimType('UMRAH');
        }
      } else if (route.params.packageName) {
        setTourCountry(route.params.packageName);
      }
    }
  }, [route.params]);

  const [busy, setBusy] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Calendar calculation
  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const isCurrentMonthAndYear =
    calYear === today.getFullYear() && calMonth === today.getMonth();

  const prevMonth = () => {
    if (isCurrentMonthAndYear) return;
    setCalDate(new Date(calYear, calMonth - 1, 1));
  };

  const nextMonth = () => {
    setCalDate(new Date(calYear, calMonth + 1, 1));
  };

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();

  const calendarCells: { day: number; iso: string; isPast: boolean; isToday: boolean }[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push({ day: 0, iso: '', isPast: true, isToday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const cellDate = new Date(calYear, calMonth, d, 23, 59, 59);
    const isPast = cellDate.getTime() < today.getTime() - 86400000;
    const isToday = iso === todayIso;
    calendarCells.push({ day: d, iso, isPast, isToday });
  }

  const quickOptions = [
    {
      label: '+1 Month',
      date: new Date(today.getFullYear(), today.getMonth() + 1, 15),
      active: calMonth === (today.getMonth() + 1) % 12,
    },
    {
      label: '+2 Months',
      date: new Date(today.getFullYear(), today.getMonth() + 2, 15),
      active: calMonth === (today.getMonth() + 2) % 12,
    },
    {
      label: '+3 Months',
      date: new Date(today.getFullYear(), today.getMonth() + 3, 15),
      active: calMonth === (today.getMonth() + 3) % 12,
    },
  ];

  const selectQuickDate = (d: Date) => {
    const iso = d.toISOString().slice(0, 10);
    setCalDate(new Date(d.getFullYear(), d.getMonth(), 1));
    setTempSelectedIso(iso);
  };

  async function submit() {
    if (busy) return;
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Please enter your Full Name';
    if (!phone.trim()) errors.phone = 'Please enter your Contact Number / WhatsApp';
    if (!preferredDate.trim()) errors.date = 'Please select your expected travel date';

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setFormError({});
    setBusy(true);

    try {
      const key = (idempotencyKey.current = `MOB-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${Math.floor(1000 + Math.random() * 9000)}`);
      const numAdults = Number(adults) || 1;
      const numChildren = Number(children) || 0;
      const numInfants = Number(infants) || 0;
      const totalMembers = numAdults + numChildren + numInfants;

      let serviceLabel = '';
      let targetCountry = '';
      let detailedNotes = '';
      let serviceTypeApi = 'tour';

      if (mainCat === 'tour') {
        serviceTypeApi = 'tour';
        serviceLabel = `Tour: ${tourCountry} (${tourType})`;
        targetCountry = tourCountry;
        detailedNotes = `Tour: ${tourCountry}\nMode: ${tourType}\nDuration: ${nights} Nights\nCity: ${city}\nNotes: ${instructions}`;
      } else if (mainCat === 'hajj-umrah') {
        serviceTypeApi = 'umrah';
        const isHajj = pilgrimType === 'HAJJ';
        serviceLabel = isHajj
          ? `${pilgrimTier === 'premium' ? 'Premium' : 'Economy'} Hajj Package`
          : `${pilgrimTier === 'premium' ? 'Premium' : 'Economy'} Umrah Package`;
        targetCountry = 'Saudi Arabia (Makkah & Madinah)';
        detailedNotes = `Pilgrimage: ${isHajj ? 'Hajj' : 'Umrah'}\nTier: ${pilgrimTier.toUpperCase()}\nRoom Sharing: ${roomSharing}\nCity: ${city}\nSpecial Requests: ${instructions}`;
      } else if (mainCat === 'visa') {
        serviceTypeApi = 'visa';
        if (visaSubCat === 'us') {
          serviceLabel = `USA Visa: ${usVisaType} (${usEntry})`;
          targetCountry = 'United States';
          detailedNotes = `Visa: USA\nCategory: ${usVisaType}\nEntry: ${usEntry}\nCity: ${city}\nNotes: ${instructions}`;
        } else if (visaSubCat === 'uk') {
          serviceLabel = `UK Visa: ${ukVisaType} (${ukValidity})`;
          targetCountry = 'United Kingdom';
          detailedNotes = `Visa: UK\nCategory: ${ukVisaType}\nValidity: ${ukValidity}\nCity: ${city}\nNotes: ${instructions}`;
        } else if (visaSubCat === 'schengen') {
          serviceLabel = `Schengen Visa (${schengenCountry}): ${schengenVisaType}`;
          targetCountry = `${schengenCountry} (Schengen)`;
          detailedNotes = `Visa: Schengen (${schengenCountry})\nType: ${schengenVisaType}\nEntry: ${schengenEntry}\nCity: ${city}\nNotes: ${instructions}`;
        } else if (visaSubCat === 'canada') {
          serviceLabel = `Canada Visa: ${canadaVisaType}`;
          targetCountry = 'Canada';
          detailedNotes = `Visa: Canada\nCategory: ${canadaVisaType}\nBiometrics: ${canadaBiometrics}\nCity: ${city}\nNotes: ${instructions}`;
        } else if (visaSubCat === 'gcc') {
          serviceLabel = `GCC Visa (${gccCountry}): ${gccVisaType} - ${gccEntry}`;
          targetCountry = gccCountry;
          detailedNotes = `GCC Country: ${gccCountry}\nCategory: ${gccVisaType}\nEntry: ${gccEntry}\nGCC Resident Scheme: ${gccResidentOption ? 'YES' : 'NO'}\nCity: ${city}\nNotes: ${instructions}`;
        } else {
          serviceLabel = `Global E-Visa (${evisaCountry}): ${evisaPurpose}`;
          targetCountry = evisaCountry;
          detailedNotes = `E-Visa Country: ${evisaCountry}\nPurpose: ${evisaPurpose}\nCity: ${city}\nNotes: ${instructions}`;
        }
      }

      const isoDate = normalizeDateToISO(preferredDate);

      const res = await sendEnquiry(
        {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || 'traveller@example.com',
          members: totalMembers,
          adults: numAdults,
          children: numChildren,
          kids: numChildren,
          infants: numInfants,
          serviceType: serviceTypeApi,
          visaType: mainCat === 'visa' ? serviceLabel : undefined,
          tourType: mainCat === 'tour' ? tourType : undefined,
          tier: mainCat === 'hajj-umrah' ? pilgrimTier : undefined,
          country: targetCountry,
          packageName: serviceLabel,
          preferredDate: isoDate,
          days: Number(nights) || 5,
          nights: Number(nights) || 5,
          instructions: detailedNotes,
          consent: true,
          sourcePlatform: Platform.OS === 'ios' ? 'IOS' : Platform.OS === 'web' ? 'WEBSITE' : 'ANDROID',
        },
        key,
      );

      const ref = res?.reference || generateRandomMobileReference();
      idempotencyKey.current = null;

      // Trigger cross-platform success modal
      setSubmissionSuccess({
        reference: ref,
        fullName: fullName.trim(),
        phone: phone.trim(),
        serviceLabel,
        preferredDate: isoDate,
        numAdults,
        numChildren,
        numInfants,
        detailedNotes,
      });
    } catch (err: any) {
      setFormError({ general: err.message || 'Unable to submit enquiry. Please check connection.' });
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={s.screen}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <BrandHeader subtitle="Dedicated Holiday Tours, Hajj & Umrah, and Global Visas" />

      {/* TOP SERVICE CATEGORY SWITCHER */}
      <View style={s.catNav}>
        <TouchableOpacity
          style={[s.catBtn, mainCat === 'tour' && s.catBtnActive]}
          onPress={() => setMainCat('tour')}
        >
          <Text style={[s.catBtnText, mainCat === 'tour' && s.catBtnTextActive]}>🌍 Holiday Tour</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.catBtn, mainCat === 'hajj-umrah' && s.catBtnActive]}
          onPress={() => setMainCat('hajj-umrah')}
        >
          <Text style={[s.catBtnText, mainCat === 'hajj-umrah' && s.catBtnTextActive]}>🕋 Hajj &amp; Umrah</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.catBtn, mainCat === 'visa' && s.catBtnActive]}
          onPress={() => setMainCat('visa')}
        >
          <Text style={[s.catBtnText, mainCat === 'visa' && s.catBtnTextActive]}>🛂 Visa Desk</Text>
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        {/* Validation Error Banner */}
        {Object.keys(formError).length > 0 && (
          <View style={s.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#dc2626" style={{ marginRight: 8 }} />
            <Text style={s.errorBannerText}>
              {formError.general || 'Please fill in all required fields marked with * below.'}
            </Text>
          </View>
        )}

        {/* Customer Information */}
        <View style={s.field}>
          <Text style={s.label}>Full Name *</Text>
          <TextInput
            style={[s.input, formError.fullName && s.inputError]}
            value={fullName}
            onChangeText={(t) => {
              setFullName(t);
              if (formError.fullName) setFormError((p) => ({ ...p, fullName: undefined }));
            }}
          />
          {formError.fullName && <Text style={s.errorHint}>{formError.fullName}</Text>}
        </View>

        <View style={s.field}>
          <Text style={s.label}>Contact Number / WhatsApp *</Text>
          <TextInput
            style={[s.input, formError.phone && s.inputError]}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              if (formError.phone) setFormError((p) => ({ ...p, phone: undefined }));
            }}
          />
          {formError.phone && <Text style={s.errorHint}>{formError.phone}</Text>}
        </View>

        <View style={s.field}>
          <Text style={s.label}>Email Address</Text>
          <TextInput
            style={s.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={s.field}>
          <Text style={s.label}>City of Residence / Departure City</Text>
          <TextInput
            style={s.input}
            value={city}
            onChangeText={setCity}
          />
        </View>

        {/* Travelers Breakdown */}
        <View style={s.field}>
          <Text style={[s.label, { color: '#0284c7' }]}>NUMBER OF TRAVELERS / APPLICANTS</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.subLabel}>Adult (12+ yrs) *</Text>
              <TextInput
                style={s.input}
                keyboardType="number-pad"
                value={adults}
                onChangeText={setAdults}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.subLabel}>Child (&lt;12 yrs)</Text>
              <TextInput
                style={s.input}
                keyboardType="number-pad"
                value={children}
                onChangeText={setChildren}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.subLabel}>Infant (0-2 yrs)</Text>
              <TextInput
                style={s.input}
                keyboardType="number-pad"
                value={infants}
                onChangeText={setInfants}
              />
            </View>
          </View>
        </View>

        {/* =========================================================================
            SECTION 1: GENERAL HOLIDAY TOUR (EXCLUSIVE TO ALL PACKAGES & DESTINATIONS)
           ========================================================================= */}
        {mainCat === 'tour' && (
          <View style={s.conditionalBox}>
            <Text style={s.sectionTitle}>🌍 HOLIDAY TOUR DESTINATION</Text>

            <View style={s.field}>
              <Text style={s.label}>Select Destination / Package *</Text>
              <TouchableOpacity
                style={[s.input, s.pickerBtn]}
                onPress={() => setShowCountryPicker(!showCountryPicker)}
              >
                <Text style={s.pickerText} numberOfLines={1}>{tourCountry}</Text>
                <Ionicons name={showCountryPicker ? 'chevron-up' : 'chevron-down'} size={18} color="#64748b" />
              </TouchableOpacity>

              {showCountryPicker && (
                <View style={s.dropdownList}>
                  <TextInput
                    style={[s.input, { margin: 6, paddingVertical: 6, fontSize: 13, backgroundColor: '#f1f5f9' }]}
                    placeholder="🔍 Search packages or destination..."
                    placeholderTextColor="#94a3b8"
                    value={countrySearch}
                    onChangeText={setCountrySearch}
                    autoCapitalize="none"
                  />
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                    {[
                      'Dubai Holiday Package',
                      'Maldives Luxury Lagoon Escape',
                      'Sri Lanka Wonder Island',
                      'Andaman Tropical Island Discovery',
                      'Bali Paradise Island Tour',
                      'Thailand Triple City Adventure',
                      'Kashmir Paradise on Earth',
                      'Goa Sun, Sand & Spice Retreat',
                      'Custom Multi-City Holiday',
                      ...ORDERED_COUNTRIES,
                    ]
                      .filter((c, i, arr) => arr.indexOf(c) === i)
                      .filter((c) => !countrySearch || c.toLowerCase().includes(countrySearch.toLowerCase()))
                      .map((c) => (
                        <TouchableOpacity
                           key={c}
                          style={[s.dropdownItem, c === tourCountry && s.dropdownItemActive]}
                          onPress={() => {
                            setTourCountry(c);
                            setShowCountryPicker(false);
                            setCountrySearch('');
                          }}
                        >
                          <Text style={[s.dropdownText, c === tourCountry && s.dropdownTextActive]}>{c}</Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={s.field}>
              <Text style={s.label}>Tour Style *</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {(['Private Tour', 'Group Tour'] as const).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[s.optionChip, { flex: 1 }, tourType === mode && s.optionChipActive]}
                    onPress={() => setTourType(mode)}
                  >
                    <Text style={[s.optionChipText, tourType === mode && s.optionChipTextActive]}>{mode}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>Number of Nights *</Text>
              <TextInput
                style={s.input}
                keyboardType="number-pad"
                value={nights}
                onChangeText={setNights}
              />
            </View>
          </View>
        )}

        {/* =========================================================================
            SECTION 2: HAJJ & UMRAH (EXCLUSIVE PILGRIMAGE PACKAGES ONLY)
           ========================================================================= */}
        {mainCat === 'hajj-umrah' && (
          <View style={s.conditionalBox}>
            <Text style={s.sectionTitle}>🕋 HAJJ &amp; UMRAH PILGRIMAGE</Text>

            <View style={s.field}>
              <Text style={s.label}>Pilgrimage Type *</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {(['UMRAH', 'HAJJ'] as const).map((kind) => (
                  <TouchableOpacity
                    key={kind}
                    style={[s.optionChip, { flex: 1 }, pilgrimType === kind && s.optionChipActive]}
                    onPress={() => setPilgrimType(kind)}
                  >
                    <Text style={[s.optionChipText, pilgrimType === kind && s.optionChipTextActive]}>
                      {kind === 'UMRAH' ? 'Umrah Pilgrimage' : 'Hajj Pilgrimage'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>Package Tier *</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={[s.optionChip, { flex: 1 }, pilgrimTier === 'premium' && s.optionChipActive]}
                  onPress={() => setPilgrimTier('premium')}
                >
                  <Text style={[s.optionChipText, pilgrimTier === 'premium' && s.optionChipTextActive]}>
                    ★ Premium (5-Star Haram)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.optionChip, { flex: 1 }, pilgrimTier === 'economy' && s.optionChipActive]}
                  onPress={() => setPilgrimTier('economy')}
                >
                  <Text style={[s.optionChipText, pilgrimTier === 'economy' && s.optionChipTextActive]}>
                    Economy (Comfort &amp; Shuttle)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>Room Sharing Option *</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {[
                  'Quad Sharing (4/Room)',
                  'Triple Sharing (3/Room)',
                  'Double Sharing (2/Room)',
                  'VIP Private Room',
                ].map((room) => (
                  <TouchableOpacity
                    key={room}
                    style={[s.optionChipSmall, roomSharing === room && s.optionChipActive]}
                    onPress={() => setRoomSharing(room)}
                  >
                    <Text style={[s.optionChipTextSmall, roomSharing === room && s.optionChipTextActive]}>
                      {room}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* =========================================================================
            SECTION 3: VISA SERVICES DESK (SEPARATE FORMS FOR US, UK, SCHENGEN, CANADA, GCC, EVISA)
           ========================================================================= */}
        {mainCat === 'visa' && (
          <View style={s.conditionalBox}>
            <Text style={s.sectionTitle}>🛂 SPECIALIZED VISA FORMS</Text>

            {/* Visa Sub-tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {[
                  { id: 'us', label: '🇺🇸 USA Visa' },
                  { id: 'uk', label: '🇬🇧 UK Visa' },
                  { id: 'schengen', label: '🇪🇺 Schengen' },
                  { id: 'canada', label: '🇨🇦 Canada' },
                  { id: 'gcc', label: '🌴 GCC Visas' },
                  { id: 'evisa', label: '⚡ E-Visa' },
                ].map((tab) => (
                  <TouchableOpacity
                    key={tab.id}
                    style={[s.visaTabBtn, visaSubCat === tab.id && s.visaTabBtnActive]}
                    onPress={() => setVisaSubCat(tab.id as VisaCategory)}
                  >
                    <Text style={[s.visaTabText, visaSubCat === tab.id && s.visaTabTextActive]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* USA Visa Specific Form */}
            {visaSubCat === 'us' && (
              <View>
                <Text style={s.subHeader}>USA Visa Options (B1/B2 &amp; F1/M1)</Text>
                <View style={s.field}>
                  <Text style={s.label}>Purpose / Category *</Text>
                  {['Tourist & Business (B1/B2)', 'Tourist (B2 Visitor)', 'Business (B1)', 'Student Visa (F1/M1)'].map(
                    (opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={[s.choiceRow, usVisaType === opt && s.choiceRowActive]}
                        onPress={() => setUsVisaType(opt)}
                      >
                        <Text style={[s.choiceText, usVisaType === opt && s.choiceTextActive]}>{opt}</Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            )}

            {/* UK Visa Specific Form */}
            {visaSubCat === 'uk' && (
              <View>
                <Text style={s.subHeader}>UK Standard Visitor &amp; Student Visa</Text>
                <View style={s.field}>
                  <Text style={s.label}>Visa Category *</Text>
                  {['Tourist Visa', 'Business Visa', 'Student Visa (Education)', 'Family Visitor'].map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[s.choiceRow, ukVisaType === opt && s.choiceRowActive]}
                      onPress={() => setUkVisaType(opt)}
                    >
                      <Text style={[s.choiceText, ukVisaType === opt && s.choiceTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={s.field}>
                  <Text style={s.label}>Requested Validity</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {['6 Months Standard', '2 Years', '5 Years', '10 Years'].map((val) => (
                      <TouchableOpacity
                        key={val}
                        style={[s.optionChipSmall, ukValidity === val && s.optionChipActive]}
                        onPress={() => setUkValidity(val)}
                      >
                        <Text style={[s.optionChipTextSmall, ukValidity === val && s.optionChipTextActive]}>
                          {val}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Schengen Visa Specific Form */}
            {visaSubCat === 'schengen' && (
              <View>
                <Text style={s.subHeader}>Schengen 29-Nation European Visa</Text>
                <View style={s.field}>
                  <Text style={s.label}>Primary Destination Country *</Text>
                  <TouchableOpacity
                    style={[s.input, s.pickerBtn]}
                    onPress={() => setShowCountryPicker(!showCountryPicker)}
                  >
                    <Text style={s.pickerText} numberOfLines={1}>{schengenCountry} (Schengen)</Text>
                    <Ionicons name={showCountryPicker ? 'chevron-up' : 'chevron-down'} size={18} color="#64748b" />
                  </TouchableOpacity>

                  {showCountryPicker && (
                    <View style={s.dropdownList}>
                      <ScrollView nestedScrollEnabled style={{ maxHeight: 180 }}>
                        {SCHENGEN_COUNTRIES.map((c) => (
                          <TouchableOpacity
                            key={c}
                            style={[s.dropdownItem, c === schengenCountry && s.dropdownItemActive]}
                            onPress={() => {
                              setSchengenCountry(c);
                              setShowCountryPicker(false);
                            }}
                          >
                            <Text style={[s.dropdownText, c === schengenCountry && s.dropdownTextActive]}>{c}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View style={s.field}>
                  <Text style={s.label}>Type &amp; Entry</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {['Tourist Visa', 'Business Visa'].map((st) => (
                      <TouchableOpacity
                        key={st}
                        style={[s.optionChip, { flex: 1 }, schengenVisaType === st && s.optionChipActive]}
                        onPress={() => setSchengenVisaType(st)}
                      >
                        <Text style={[s.optionChipText, schengenVisaType === st && s.optionChipTextActive]}>{st}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Canada Visa Specific Form */}
            {visaSubCat === 'canada' && (
              <View>
                <Text style={s.subHeader}>Canada Visitor &amp; Super Visa</Text>
                <View style={s.field}>
                  <Text style={s.label}>Category *</Text>
                  {['Tourist (V1)', 'Business (B1)', 'Super Visa (Parents/Grandparents)'].map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[s.choiceRow, canadaVisaType === opt && s.choiceRowActive]}
                      onPress={() => setCanadaVisaType(opt)}
                    >
                      <Text style={[s.choiceText, canadaVisaType === opt && s.choiceTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* GCC Countries Visa Specific Form */}
            {visaSubCat === 'gcc' && (
              <View>
                <Text style={s.subHeader}>GCC Visas (Saudi, UAE, Oman, Kuwait, Qatar)</Text>

                <View style={s.field}>
                  <Text style={s.label}>Select GCC Country *</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {GCC_COUNTRIES.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={[s.optionChipSmall, gccCountry === c && s.optionChipActive]}
                        onPress={() => setGccCountry(c)}
                      >
                        <Text style={[s.optionChipTextSmall, gccCountry === c && s.optionChipTextActive]}>
                          {c}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={s.field}>
                  <Text style={s.label}>Entry Type *</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {(['Single Entry', 'Multiple Entry'] as const).map((ent) => (
                      <TouchableOpacity
                        key={ent}
                        style={[s.optionChip, { flex: 1 }, gccEntry === ent && s.optionChipActive]}
                        onPress={() => setGccEntry(ent)}
                      >
                        <Text style={[s.optionChipText, gccEntry === ent && s.optionChipTextActive]}>{ent}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={s.field}>
                  <Text style={s.label}>Visa Scheme *</Text>
                  {[
                    'Standard Tourist eVisa',
                    '⭐ GCC Resident Visa option (For GCC Iqama Holders)',
                    'Business / Commercial eVisa',
                  ].map((sc) => (
                    <TouchableOpacity
                      key={sc}
                      style={[s.choiceRow, gccVisaType === sc && s.choiceRowActive]}
                      onPress={() => setGccVisaType(sc)}
                    >
                      <Text style={[s.choiceText, gccVisaType === sc && s.choiceTextActive]}>{sc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Global E-Visa Specific Form */}
            {visaSubCat === 'evisa' && (
              <View>
                <Text style={s.subHeader}>Global E-Visa Country List</Text>
                <View style={s.field}>
                  <Text style={s.label}>Select E-Visa Country *</Text>
                  <TouchableOpacity
                    style={[s.input, s.pickerBtn]}
                    onPress={() => setShowCountryPicker(!showCountryPicker)}
                  >
                    <Text style={s.pickerText} numberOfLines={1}>{evisaCountry} (E-Visa)</Text>
                    <Ionicons name={showCountryPicker ? 'chevron-up' : 'chevron-down'} size={18} color="#64748b" />
                  </TouchableOpacity>

                  {showCountryPicker && (
                    <View style={s.dropdownList}>
                      <ScrollView nestedScrollEnabled style={{ maxHeight: 180 }}>
                        {EVISA_COUNTRIES.map((c) => (
                          <TouchableOpacity
                            key={c}
                            style={[s.dropdownItem, c === evisaCountry && s.dropdownItemActive]}
                            onPress={() => {
                              setEvisaCountry(c);
                              setShowCountryPicker(false);
                            }}
                          >
                            <Text style={[s.dropdownText, c === evisaCountry && s.dropdownTextActive]}>{c}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Expected Date of Travel with Interactive Calendar */}
        <View style={s.field}>
          <Text style={s.label}>Expected Date of Travel / Target Month *</Text>
          <TouchableOpacity
            style={[s.input, s.datePickerBtn, formError.date && s.inputError]}
            onPress={() => {
              setTempSelectedIso(preferredDate || todayIso);
              setShowCalendar(true);
            }}
            activeOpacity={0.85}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <Ionicons name="calendar" size={18} color="#0284c7" />
              <Text style={preferredDate ? s.datePickerTextSelected : s.datePickerTextPlaceholder}>
                {preferredDate ? formatDisplayDate(preferredDate) : 'Tap to select travel date from calendar...'}
              </Text>
            </View>
            <View style={s.calPillTag}>
              <Text style={s.calPillTagText}>Calendar</Text>
              <Ionicons name="chevron-down" size={14} color="#0284c7" style={{ marginLeft: 3 }} />
            </View>
          </TouchableOpacity>
          {formError.date && <Text style={s.errorHint}>{formError.date}</Text>}
        </View>

        {/* Additional Notes (Shared) */}
        <View style={s.field}>
          <Text style={s.label}>Additional Notes &amp; Special Requirements</Text>
          <TextInput
            style={[s.input, s.textArea]}
            multiline
            numberOfLines={3}
            value={instructions}
            onChangeText={setInstructions}
          />
        </View>

        <PrimaryButton
          title={busy ? 'Submitting Enquiry...' : 'Submit Enquiry ↗'}
          onPress={submit}
        />

        <Text style={s.disclaimer}>
          🔒 Official SkyRay booking enquiry. Availability, visa rules, and final quotes are confirmed directly by our concierge.
        </Text>
      </View>

      {/* =========================================================================
          INTERACTIVE CALENDAR MODAL
         ========================================================================= */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.calendarCard}>
            {/* Header: Month & Year Navigator */}
            <View style={s.calendarHeader}>
              <TouchableOpacity
                style={[s.monthNavBtn, isCurrentMonthAndYear && { opacity: 0.3 }]}
                disabled={isCurrentMonthAndYear}
                onPress={prevMonth}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={20} color="#0f2942" />
              </TouchableOpacity>

              <Text style={s.monthTitle}>
                {MONTH_NAMES[calMonth]} {calYear}
              </Text>

              <TouchableOpacity
                style={s.monthNavBtn}
                onPress={nextMonth}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-forward" size={20} color="#0f2942" />
              </TouchableOpacity>
            </View>

            {/* Quick Month Select Chips */}
            <View style={s.quickSelectRow}>
              {quickOptions.map((q, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[s.quickChip, q.active && s.quickChipActive]}
                  onPress={() => selectQuickDate(q.date)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.quickChipText, q.active && s.quickChipTextActive]}>
                    {q.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Days of Week Header */}
            <View style={s.weekDaysRow}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, idx) => (
                <Text key={idx} style={s.weekDayText}>{d}</Text>
              ))}
            </View>

            {/* Days Grid */}
            <View style={s.daysGrid}>
              {calendarCells.map((cell, idx) => {
                if (!cell.day) {
                  return <View key={`blank-${idx}`} style={s.dayCell} />;
                }
                const isSelected = cell.iso === tempSelectedIso;
                const isPast = cell.isPast;
                const isToday = cell.isToday;

                return (
                  <TouchableOpacity
                    key={`day-${cell.day}`}
                    style={[
                      s.dayCell,
                      isToday && !isSelected && s.dayCellToday,
                      isSelected && s.dayCellSelected,
                    ]}
                    disabled={isPast}
                    onPress={() => setTempSelectedIso(cell.iso)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        s.dayCellText,
                        isPast && s.dayCellTextDisabled,
                        isToday && !isSelected && s.dayCellTextToday,
                        isSelected && s.dayCellTextSelected,
                      ]}
                    >
                      {cell.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Selected Date Preview & Actions */}
            <View style={s.calendarFooter}>
              <View style={s.datePreviewBox}>
                <Ionicons name="checkmark-circle" size={16} color="#0284c7" />
                <Text style={s.datePreviewText}>
                  {tempSelectedIso ? `Selected: ${formatDisplayDate(tempSelectedIso)}` : 'Select a date'}
                </Text>
              </View>

              <View style={s.calendarActionsRow}>
                <TouchableOpacity
                  style={s.calendarCancelBtn}
                  onPress={() => setShowCalendar(false)}
                  activeOpacity={0.75}
                >
                  <Text style={s.calendarCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.calendarConfirmBtn, !tempSelectedIso && { opacity: 0.5 }]}
                  disabled={!tempSelectedIso}
                  onPress={() => {
                    setPreferredDate(tempSelectedIso);
                    setShowCalendar(false);
                    if (formError.date) setFormError((prev) => ({ ...prev, date: undefined }));
                  }}
                  activeOpacity={0.88}
                >
                  <Text style={s.calendarConfirmBtnText}>Apply Date</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          CROSS-PLATFORM SUBMISSION SUCCESS CONFIRMATION MODAL
         ========================================================================= */}
      <Modal
        visible={!!submissionSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setSubmissionSuccess(null);
          navigation.goBack();
        }}
      >
        <View style={s.modalOverlay}>
          <View style={s.successCard}>
            <View style={s.successIconWrap}>
              <Ionicons name="checkmark-circle" size={56} color="#16a34a" />
            </View>

            <Text style={s.successTitle}>Enquiry Received!</Text>
            <Text style={s.successSub}>
              Thank you, <Text style={{ fontWeight: '800', color: '#0f2942' }}>{submissionSuccess?.fullName}</Text>! Your travel request has been logged with SkyRay Holidays.
            </Text>

            <View style={s.refBadge}>
              <Text style={s.refBadgeLabel}>REFERENCE NUMBER</Text>
              <Text style={s.refBadgeVal}>{submissionSuccess?.reference}</Text>
            </View>

            <View style={s.summaryBox}>
              <View style={s.summaryRow}>
                <Text style={s.summaryKey}>Service:</Text>
                <Text style={s.summaryVal} numberOfLines={1}>{submissionSuccess?.serviceLabel}</Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryKey}>Travel Date:</Text>
                <Text style={s.summaryVal}>{formatDisplayDate(submissionSuccess?.preferredDate || '')}</Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryKey}>Applicants:</Text>
                <Text style={s.summaryVal}>
                  {submissionSuccess?.numAdults} Adult(s), {submissionSuccess?.numChildren} Child(ren)
                </Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryKey}>Phone:</Text>
                <Text style={s.summaryVal}>{submissionSuccess?.phone}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={s.whatsappFastTrackBtn}
              activeOpacity={0.88}
              onPress={() => {
                const sub = submissionSuccess;
                if (!sub) return;
                const text = encodeURIComponent(
                  `*SkyRay Holidays Mobile Enquiry*\n` +
                  `• Reference: ${sub.reference}\n` +
                  `• Name: ${sub.fullName}\n` +
                  `• Phone: ${sub.phone}\n` +
                  `• Service: ${sub.serviceLabel}\n` +
                  `• Travel Date: ${formatDisplayDate(sub.preferredDate)}\n` +
                  `• Travelers: ${sub.numAdults} Adult(s), ${sub.numChildren} Child(ren), ${sub.numInfants} Infant(s)\n` +
                  `\n*Details:*\n${sub.detailedNotes}\n\nPlease share official quotation and checklist.`
                );
                Linking.openURL(`https://wa.me/919176357791?text=${text}`).catch(() => {});
                setSubmissionSuccess(null);
                navigation.goBack();
              }}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={s.whatsappFastTrackBtnText}>Fast-Track on WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.doneBtn}
              activeOpacity={0.75}
              onPress={() => {
                setSubmissionSuccess(null);
                navigation.goBack();
              }}
            >
              <Text style={s.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  catNav: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  catBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catBtnActive: { backgroundColor: '#0284c7', borderColor: '#0284c7' },
  catBtnText: { fontSize: 11.5, fontWeight: '700', color: '#334155' },
  catBtnTextActive: { color: '#ffffff' },
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
  subHeader: { fontSize: 12, fontWeight: '800', color: '#0284c7', marginBottom: 8, textTransform: 'uppercase' },
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
  optionChip: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  optionChipActive: { backgroundColor: '#0284c7', borderColor: '#0284c7' },
  optionChipText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  optionChipTextActive: { color: '#ffffff' },
  optionChipSmall: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  optionChipTextSmall: { fontSize: 11, fontWeight: '700', color: '#475569' },
  visaTabBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  visaTabBtnActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  visaTabText: { fontSize: 11.5, fontWeight: '700', color: '#475569' },
  visaTabTextActive: { color: '#ffffff' },
  choiceRow: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    marginBottom: 6,
  },
  choiceRowActive: { borderColor: '#0284c7', backgroundColor: '#f0f9ff' },
  choiceText: { fontSize: 12.5, fontWeight: '600', color: '#334155' },
  choiceTextActive: { color: '#0284c7', fontWeight: '800' },
  conditionalBox: {
    backgroundColor: '#f8fcfe',
    borderWidth: 1,
    borderColor: '#e0f2fe',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284c7',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  textArea: { minHeight: 70, textAlignVertical: 'top' },
  disclaimer: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },

  // Date Picker Custom Styles
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  datePickerTextSelected: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f2942',
  },
  datePickerTextPlaceholder: {
    fontSize: 13.5,
    color: '#94a3b8',
  },
  calPillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  calPillTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284c7',
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  // Calendar Card
  calendarCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f2942',
  },
  quickSelectRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  quickChipActive: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0284c7',
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  quickChipTextActive: {
    color: '#0284c7',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 8,
  },
  weekDayText: {
    width: 38,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: '#0284c7',
  },
  dayCellSelected: {
    backgroundColor: '#0284c7',
  },
  dayCellText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  dayCellTextDisabled: {
    color: '#cbd5e1',
  },
  dayCellTextToday: {
    color: '#0284c7',
    fontWeight: '800',
  },
  dayCellTextSelected: {
    color: '#ffffff',
    fontWeight: '800',
  },
  calendarFooter: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  datePreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
    backgroundColor: '#f0f9ff',
    paddingVertical: 8,
    borderRadius: 10,
  },
  datePreviewText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369a1',
  },
  calendarActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  calendarCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  calendarCancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  calendarConfirmBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#0284c7',
    alignItems: 'center',
  },
  calendarConfirmBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },

  // Success Modal
  successCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconWrap: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f2942',
    marginBottom: 6,
  },
  successSub: {
    fontSize: 13,
    lineHeight: 18,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 14,
  },
  refBadge: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
    width: '100%',
  },
  refBadgeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16a34a',
    letterSpacing: 0.8,
  },
  refBadgeVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#15803d',
    marginTop: 2,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryKey: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f2942',
    maxWidth: '70%',
    textAlign: 'right',
  },
  whatsappFastTrackBtn: {
    width: '100%',
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  whatsappFastTrackBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  doneBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },

  // Error Banner & Input error
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorBannerText: {
    fontSize: 12,
    color: '#b91c1c',
    fontWeight: '700',
    flex: 1,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fff5f5',
  },
  errorHint: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 4,
  },
});
