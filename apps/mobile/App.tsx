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
import { Ionicons } from '@expo/vector-icons';

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
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 26 : 10,
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
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Packages') {
            iconName = focused ? 'airplane' : 'airplane-outline';
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
                paddingVertical: 3,
                paddingHorizontal: 10,
                borderRadius: 14,
                backgroundColor: focused ? 'rgba(14, 165, 233, 0.12)' : 'transparent',
              }}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={focused ? '#0ea5e9' : color}
              />
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
