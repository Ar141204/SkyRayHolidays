import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const C = {
  deep: '#17496B',
  sky: '#0ea5e9',
  skyDark: '#0284c7',
  pale: '#F0F9FF',
  gold: '#f59e0b',
  goldPale: '#FEF3C7',
  muted: '#64748b',
  ink: '#0f172a',
  line: '#e2e8f0',
  surface: '#ffffff',
  background: '#f8fafc',
  success: '#10b981',
  successPale: '#ecfdf5',
};

// Official SkyRay Holidays Logo Asset
const logoSource = require('../../assets/logo.png');

interface BrandHeaderProps {
  subtitle?: string;
  showContactAction?: boolean;
  onContactPress?: () => void;
}

export function BrandHeader({
  subtitle = 'Explore. Plan. Travel.',
  showContactAction = true,
  onContactPress,
}: BrandHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleWhatsApp = () => {
    if (onContactPress) {
      onContactPress();
    } else {
      Linking.openURL('https://wa.me/919176357791?text=Hello%20SkyRay%20Holidays!').catch(() => { });
    }
  };

  return (
    <View style={[s.header, { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 14 : 10) + 4 }]}>
      <View style={s.brandRow}>
        <View style={s.logoWrap}>
          <Image
            source={logoSource}
            style={s.logoImage}
            resizeMode="contain"
            accessibilityLabel="SkyRay Holidays Logo"
          />
        </View>

        {showContactAction && (
          <TouchableOpacity
            style={s.headerCta}
            onPress={handleWhatsApp}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Chat on WhatsApp"
          >
            <Ionicons name="logo-whatsapp" size={15} color="#ffffff" style={{ marginRight: 5 }} />
            <Text style={s.headerCtaText}>Chat</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gold' | 'outline';
  size?: 'normal' | 'small';
}

export function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  size = 'normal',
}: PrimaryButtonProps) {
  const btnStyle = [
    s.btn,
    variant === 'gold' && s.btnGold,
    variant === 'secondary' && s.btnSecondary,
    variant === 'outline' && s.btnOutline,
    size === 'small' && s.btnSmall,
  ];

  const textStyle = [
    s.btnText,
    variant === 'outline' && s.btnOutlineText,
    variant === 'secondary' && s.btnSecondaryText,
    size === 'small' && s.btnSmallText,
  ];

  return (
    <TouchableOpacity style={btnStyle} onPress={onPress} activeOpacity={0.85}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

interface ScreenTitleProps {
  eyebrow?: string;
  title: string;
  body?: string;
}

export function ScreenTitle({ eyebrow, title, body }: ScreenTitleProps) {
  return (
    <View style={s.titleContainer}>
      {eyebrow && <Text style={s.eyebrow}>{eyebrow.toUpperCase()}</Text>}
      <Text style={s.title}>{title}</Text>
      {body && <Text style={s.body}>{body}</Text>}
    </View>
  );
}

export function Badge({
  label,
  variant = 'neutral',
}: {
  label: string;
  variant?: 'sky' | 'gold' | 'success' | 'neutral';
}) {
  const badgeStyle = [
    s.badge,
    variant === 'sky' && s.badgeSky,
    variant === 'gold' && s.badgeGold,
    variant === 'success' && s.badgeSuccess,
  ];

  const textStyle = [
    s.badgeText,
    variant === 'sky' && s.badgeTextSky,
    variant === 'gold' && s.badgeTextGold,
    variant === 'success' && s.badgeTextSuccess,
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 16 : 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 96,
    height: 82,
  },
  headerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCtaIcon: {
    fontSize: 13,
    marginRight: 5,
  },
  headerCtaText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  btn: {
    backgroundColor: C.sky,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.sky,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  btnGold: {
    backgroundColor: C.gold,
    shadowColor: C.gold,
  },
  btnSecondary: {
    backgroundColor: C.deep,
    shadowColor: C.deep,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: C.sky,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnSmall: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  btnOutlineText: {
    color: C.sky,
  },
  btnSecondaryText: {
    color: '#ffffff',
  },
  btnSmallText: {
    fontSize: 12,
    fontWeight: '700',
  },
  titleContainer: {
    marginBottom: 16,
  },
  eyebrow: {
    color: C.skyDark,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: C.deep,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  body: {
    fontSize: 14,
    color: C.muted,
    lineHeight: 21,
    marginTop: 6,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
  },
  badgeSky: {
    backgroundColor: '#e0f2fe',
  },
  badgeGold: {
    backgroundColor: '#fef3c7',
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  badgeTextSky: {
    color: '#0369a1',
  },
  badgeTextGold: {
    color: '#b45309',
  },
  badgeTextSuccess: {
    color: '#15803d',
  },
});
