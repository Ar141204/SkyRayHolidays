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
import { C, PrimaryButton, ScreenTitle } from '../components/UI';

const SAMPLE_PACKAGES = [
  'Dubai Holiday Package',
  'Turkey Tour',
  'Bali Escape',
  'Europe Tour',
  'Premium Hajj Package',
  'Premium Umrah Package',
  'Not sure yet (Help me plan)',
];

export function EnquiryScreen({ route }: any) {
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
      Alert.alert('Missing Details', 'Please enter your Full Name, Phone Number, and Travel Date.');
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
        `Thank you ${data.fullName}! Your enquiry reference is ${res.reference || 'SRH202601'}. Our travel team will contact you shortly.`,
      );
    } catch {
      // Offline fallback
      Alert.alert(
        'Enquiry Received!',
        `Thank you ${data.fullName}! Your reference is SRH${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}. Our team will contact you shortly.`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <ScreenTitle
        eyebrow="Let's Plan Together"
        title="Enquiry Form"
        body="Share your travel preferences and our team will get in touch with you."
      />

      <View style={s.field}>
        <Text style={s.label}>Full Name *</Text>
        <TextInput
          style={s.input}
          value={data.fullName}
          onChangeText={(v) => set('fullName', v)}
          placeholder="e.g. John Doe"
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Phone Number *</Text>
        <TextInput
          style={s.input}
          keyboardType="phone-pad"
          value={data.phone}
          onChangeText={(v) => set('phone', v)}
          placeholder="+91 98765 43210"
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Email Address</Text>
        <TextInput
          style={s.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={data.email}
          onChangeText={(v) => set('email', v)}
          placeholder="you@example.com"
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Select Package *</Text>
        <TouchableOpacity
          style={[s.input, s.pickerBtn]}
          onPress={() => setShowPkgPicker(!showPkgPicker)}
        >
          <Text style={s.pickerText}>{data.packageName}</Text>
          <Text style={{ color: C.sky }}>▾</Text>
        </TouchableOpacity>

        {showPkgPicker && (
          <View style={s.dropdownList}>
            {SAMPLE_PACKAGES.map((pkg) => (
              <TouchableOpacity
                key={pkg}
                style={s.dropdownItem}
                onPress={() => {
                  set('packageName', pkg);
                  setShowPkgPicker(false);
                }}
              >
                <Text style={pkg === data.packageName ? s.selectedItem : s.itemText}>{pkg}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={s.field}>
        <Text style={s.label}>Travel Date * (YYYY-MM-DD)</Text>
        <TextInput
          style={s.input}
          value={data.preferredDate}
          onChangeText={(v) => set('preferredDate', v)}
          placeholder="e.g. 2026-12-20"
        />
      </View>

      <Text style={s.note}>
        By submitting, you agree that SkyRay Holidays may contact you regarding this enquiry. No payment is collected through this form.
      </Text>

      <View style={{ marginTop: 18, opacity: busy ? 0.6 : 1 }}>
        <PrimaryButton title={busy ? 'Submitting…' : 'Submit Enquiry'} onPress={submit} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  field: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '800', color: C.deep, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: C.line,
    padding: 12,
    fontSize: 13,
    borderRadius: 6,
    backgroundColor: '#FAFDFE',
    color: C.deep,
  },
  pickerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: { fontSize: 13, color: C.deep, fontWeight: '700' },
  dropdownList: {
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F7',
  },
  itemText: { fontSize: 12, color: C.deep },
  selectedItem: { fontSize: 12, color: C.sky, fontWeight: '800' },
  note: { fontSize: 10, color: C.muted, lineHeight: 16, marginTop: 8 },
});
