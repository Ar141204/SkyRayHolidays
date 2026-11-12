import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from './src/screens/HomeScreen';
import { ServicesScreen } from './src/screens/ServicesScreen';
import { PackagesScreen } from './src/screens/PackagesScreen';
import { PilgrimageScreen } from './src/screens/PilgrimageScreen';
import { ContactScreen, ReviewsScreen, AboutScreen } from './src/screens/InfoScreens';
import { EnquiryScreen } from './src/screens/EnquiryScreen';
import { PackageDetailScreen } from './src/screens/PackageDetailScreen';

// Ensure Ionicons web font is injected for browser environments
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  try {
    const iconFontStyles = `
      @font-face {
        font-family: 'ionicons';
        src: url(${require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf')});
      }
      @font-face {
        font-family: 'Ionicons';
        src: url(${require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf')});
      }
    `;
    if (!document.getElementById('expo-ionicons-font')) {
      const style = document.createElement('style');
      style.id = 'expo-ionicons-font';
      style.type = 'text/css';
      style.appendChild(document.createTextNode(iconFontStyles));
      document.head.appendChild(style);
    }
  } catch {}
}

export type RootStackParamList = {
  Tabs: undefined;
  Services: { initialTab?: 'all' | 'packages' | 'visa' } | undefined;
  Packages: { initialTab?: 'all' | 'packages' | 'visa' } | undefined;
  Enquiry: { packageId?: string; packageName?: string; service?: string; country?: string; visaCategory?: string } | undefined;
  PackageDetail: { slug: string };
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function Tabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom : 8;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: (Platform.OS === 'ios' ? 56 : 58) + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          backgroundColor: '#ffffff',
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 1,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Services' || route.name === 'Packages') {
            iconName = focused ? 'layers' : 'layers-outline';
          } else if (route.name === 'Hajj & Umrah') {
            iconName = focused ? 'moon' : 'moon-outline';
          } else if (route.name === 'Contact') {
            iconName = focused ? 'call' : 'call-outline';
          } else if (route.name === 'Reviews') {
            iconName = focused ? 'star' : 'star-outline';
          }

          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 26,
                borderRadius: 13,
                backgroundColor: focused ? 'rgba(14, 165, 233, 0.12)' : 'transparent',
              }}
            >
              <Ionicons
                name={iconName}
                size={20}
                color={focused ? '#0ea5e9' : color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{ tabBarLabel: 'Services' }}
      />
      <Tab.Screen name="Hajj & Umrah" component={PilgrimageScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      <Tab.Screen name="Reviews" component={ReviewsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded && Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: '#0ea5e9',
            background: '#f8fafc',
            card: '#ffffff',
            text: '#0f172a',
            border: '#e2e8f0',
          },
        }}
      >
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#ffffff' },
            headerShadowVisible: false,
            headerTintColor: '#17496B',
            headerTitleStyle: { fontWeight: '800', fontSize: 16 },
          }}
        >
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="Services"
            component={ServicesScreen}
            options={{ title: 'Tour & Visa Services' }}
          />
          <Stack.Screen
            name="Packages"
            component={ServicesScreen}
            initialParams={{ initialTab: 'packages' }}
            options={{ title: 'Tour Packages' }}
          />
          <Stack.Screen
            name="Enquiry"
            component={EnquiryScreen}
            options={{ title: 'Request Custom Quote' }}
          />
          <Stack.Screen
            name="PackageDetail"
            component={PackageDetailScreen}
            options={{ title: 'Itinerary Details' }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ title: 'About SkyRay Holidays' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
