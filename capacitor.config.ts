import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'id.sch.sman6pwr.latsol',
  appName: 'latsol',
  webDir: 'dist',
  backgroundColor: '#F2EFE4',
  android: {
    backgroundColor: '#F2EFE4',
    allowMixedContent: false
  },
  ios: {
    backgroundColor: '#F2EFE4',
    contentInset: 'automatic'
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#654CE5'
    }
  }
};

export default config;
