import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Text, Platform, View } from 'react-native';

import { HomeScreen } from './src/screens/HomeScreen';
import { PackagesScreen } from './src/screens/PackagesScreen';
import { PilgrimageScreen } from './src/screens/PilgrimageScreen';
import { ContactScreen, ReviewsScreen, AboutScreen } from './src/screens/InfoScreens';
import { EnquiryScreen } from './src/screens/EnquiryScreen';
import { PackageDetailScreen } from './src/screens/PackageDetailScreen';

export type RootStackParamList = {
  Tabs: undefined;
  Enquiry: { packageId?: string; packageName?: string } | undefined;
  PackageDetail: { slug: string };
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          backgroundColor: '#ffffff',
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.03,
          shadowRadius: 8,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarIcon: ({ color, focused }) => {
          const icons: Record<string, string> = {
            Home: '🏠',
            Packages: '✈',
            'Hajj & Umrah': '☾',
            Contact: '📞',
            Reviews: '★',
          };

          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 2,
                paddingHorizontal: 8,
                borderRadius: 12,
                backgroundColor: focused ? 'rgba(14, 165, 233, 0.08)' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: focused ? '#0ea5e9' : color,
                }}
              >
                {icons[route.name] || '•'}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Packages" component={PackagesScreen} />
      <Tab.Screen name="Hajj & Umrah" component={PilgrimageScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      <Tab.Screen name="Reviews" component={ReviewsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
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
  );
}
