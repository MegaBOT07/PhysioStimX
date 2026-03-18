import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PatientRegistrationScreen } from '../screens/PatientRegistrationScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SessionSelectionScreen } from '../screens/SessionSelectionScreen';
import { NormalSessionScreen } from '../screens/NormalSessionScreen';
import { CustomSessionScreen } from '../screens/CustomSessionScreen';
import { FeedbackScreen } from '../screens/FeedbackScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { BleConnectionScreen } from '../screens/BleConnectionScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0f1f23',
    card: '#173036',
    border: '#2e606b'
  }
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RegisterPatient" component={PatientRegistrationScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SessionSelection" component={SessionSelectionScreen} />
        <Stack.Screen name="NormalSession" component={NormalSessionScreen} />
        <Stack.Screen name="CustomSession" component={CustomSessionScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        <Stack.Screen name="BleConnection" component={BleConnectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
