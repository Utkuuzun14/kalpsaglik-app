import '@/global.css';

import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from './error-boundary';

const MEDICAL_THEME = {
  dark: false,
  colors: {
    primary: '#1E6FA8',
    background: '#F0F5FA',
    card: '#FFFFFF',
    text: '#1A2E44',
    border: '#D6E4F0',
    notification: '#E53E3E',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '900' as const },
  },
};

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider value={MEDICAL_THEME}>
        <StatusBar style="dark" backgroundColor="#F0F5FA" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F0F5FA' },
            animation: 'slide_from_right',
          }}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
