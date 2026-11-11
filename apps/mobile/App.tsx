import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

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
        tabBarActiveTintColor: '#35A9E0',
        tabBarInactiveTintColor: '#8193A0',
        tabBarStyle: {
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: '#E5EDF1',
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 18 }}>
            {
              ({
                Home: '⌂',
                Packages: '✈',
                'Hajj & Umrah': '☾',
                Contact: '✉',
                Reviews: '★',
              } as any)[route.name] || '•'
            }
          </Text>
        ),
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
          primary: '#35A9E0',
          background: '#FFFFFF',
          card: '#FFFFFF',
          text: '#202B36',
          border: '#E5EDF1',
        },
      }}
    >
      <StatusBar style="dark" />
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="Enquiry"
          component={EnquiryScreen}
          options={{ title: 'Send an Enquiry', headerTintColor: '#17496B' }}
        />
        <Stack.Screen
          name="PackageDetail"
          component={PackageDetailScreen}
          options={{ title: 'Package Details', headerTintColor: '#17496B' }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'About Us', headerTintColor: '#17496B' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
