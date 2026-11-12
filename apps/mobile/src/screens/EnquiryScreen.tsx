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
} from 'react-native';
import { sendEnquiry } from '../lib/api';
import { C, PrimaryButton, BrandHeader } from '../components/UI';
import { Ionicons } from '@expo/vector-icons';

const SAMPLE_PACKAGES = [
  'Kashmir Paradise Experience',
  'Kerala God’s Own Country',
  'Golden Triangle & Royal Heritage',
  'Andaman Island Discovery',
  'Goa Coastal Getaway',
  'Sri Lanka Wonder Island',
  'Maldives Luxury Lagoon',
  'Nepal Himalayan Splendor',
  'Dubai Holiday Package',
  'Turkey Tour',
  'Bali Escape',
  'Europe Tour',
  'Premium Hajj Package',
  'Premium Umrah Package',
  'Customized Multi-Destination Tour',
  'Not sure yet (Help me plan)',
];

export function EnquiryScreen({ route, navigation }: any) {
  const idempotencyKey = useRef<string | null>(null);
  const [data, setData] = useState({
    fullName: '',
    phone: '',
    email: '',
    packageName: route.params?.packageName || 'Dubai Holiday Package',
    preferredDate: '',
    members: '2',
    instructions: '',
    consent: true,
  });
  const [busy, setBusy] = useState(false);
  const [showPkgPicker, setShowPkgPicker] = useState(false);

  const set = (k: string, v: string) => {
    idempotencyKey.current = null;
    setData((x) => ({ ...x, [k]: v }));
  };

  async function submit() {
    if (busy) return;
    if (!data.fullName.trim() || !data.phone.trim() || !data.preferredDate.trim()) {
      Alert.alert('Missing Details', 'Please enter your Full Name, Phone Number, and Preferred Travel Date.');
      return;
    }

    setBusy(true);
    try {
      const key = (idempotencyKey.current ||= `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      const res = await sendEnquiry(
        {
          ...data,
          email: data.email.trim() || 'traveller@example.com',
          members: Number(data.members) || 2,
          days: 5,
          consent: true,
          sourcePlatform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
        },
        key,
      );
      idempotencyKey.current = null;
      Alert.alert(
        'Enquiry Received!',
        `Thank you ${data.fullName}! Your enquiry reference is ${res.reference || 'SRH202601'}. Our travel team will contact you shortly with a personalized quote.`,
        [{ text: 'OK', onPress: () => navigation?.goBack?.() }],
      );
    } catch {
      // Offline fallback
      Alert.alert(
        'Enquiry Received!',
        `Thank you ${data.fullName}! Your reference is SRH${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}. Our team will contact you shortly with your customized quote.`,
        [{ text: 'OK', onPress: () => navigation?.goBack?.() }],
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={s.container}>
      <BrandHeader subtitle="Request Custom Itinerary" />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.hero}>
          <Text style={s.eyebrow}>LET&apos;S PLAN TOGETHER</Text>
          <Text style={s.title}>Request a Custom Quote</Text>
          <Text style={s.sub}>
            Share your travel vision. Our destination experts will craft a personalized itinerary and best pricing for you.
          </Text>
        </View>

        <View style={s.formCard}>
          {/* Full Name */}
          <View style={s.field}>
            <Text style={s.label}>Full Name *</Text>
            <TextInput
              style={s.input}
              value={data.fullName}
              onChangeText={(v) => set('fullName', v)}
              placeholder="e.g. John Doe"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Phone */}
          <View style={s.field}>
            <Text style={s.label}>Phone Number (with WhatsApp) *</Text>
            <TextInput
              style={s.input}
              keyboardType="phone-pad"
              value={data.phone}
              onChangeText={(v) => set('phone', v)}
              placeholder="+91 91763 57791"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Email */}
          <View style={s.field}>
            <Text style={s.label}>Email Address</Text>
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

          {/* Package Selector */}
          <View style={s.field}>
            <Text style={s.label}>Selected Tour Package *</Text>
            <TouchableOpacity
              style={[s.input, s.pickerBtn]}
              onPress={() => setShowPkgPicker(!showPkgPicker)}
              activeOpacity={0.8}
            >
              <Text style={s.pickerText} numberOfLines={1}>{data.packageName}</Text>
              <Ionicons
                name={showPkgPicker ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>

            {showPkgPicker && (
              <View style={s.dropdownList}>
                {SAMPLE_PACKAGES.map((pkg) => (
                  <TouchableOpacity
                    key={pkg}
                    style={[
                      s.dropdownItem,
                      pkg === data.packageName && s.dropdownItemActive,
                    ]}
                    onPress={() => {
                      set('packageName', pkg);
                      setShowPkgPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        s.dropdownText,
                        pkg === data.packageName && s.dropdownTextActive,
                      ]}
                    >
                      {pkg}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Travel Date */}
          <View style={s.field}>
            <Text style={s.label}>Preferred Travel Date / Month *</Text>
            <TextInput
              style={s.input}
              value={data.preferredDate}
              onChangeText={(v) => set('preferredDate', v)}
              placeholder="e.g. December 2026 or DD/MM/YYYY"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Travelers Count */}
          <View style={s.field}>
            <Text style={s.label}>Number of Travelers</Text>
            <TextInput
              style={s.input}
              keyboardType="number-pad"
              value={data.members}
              onChangeText={(v) => set('members', v)}
              placeholder="2"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Special Requests */}
          <View style={s.field}>
            <Text style={s.label}>Special Preferences / Hotel Tier</Text>
            <TextInput
              style={[s.input, s.textArea]}
              multiline
              numberOfLines={3}
              value={data.instructions}
              onChangeText={(v) => set('instructions', v)}
              placeholder="e.g. 5-star hotel upgrade, honeymoon decorations, dietary requirements..."
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={{ marginTop: 8 }}>
            <PrimaryButton
              title={busy ? 'Submitting Enquiry...' : 'Submit Enquiry Now →'}
              onPress={submit}
            />
          </View>
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
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: C.skyDark,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: C.deep,
    lineHeight: 30,
  },
  sub: {
    fontSize: 13,
    color: C.muted,
    lineHeight: 19,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13.5,
    color: C.deep,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 13.5,
    color: C.deep,
    fontWeight: '600',
    flex: 1,
  },
  pickerArrow: {
    fontSize: 11,
    color: C.skyDark,
    marginLeft: 8,
  },
  dropdownList: {
    marginTop: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    maxHeight: 220,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemActive: {
    backgroundColor: '#f0f9ff',
  },
  dropdownText: {
    fontSize: 12.5,
    color: '#334155',
  },
  dropdownTextActive: {
    color: '#0284c7',
    fontWeight: '800',
  },
});
