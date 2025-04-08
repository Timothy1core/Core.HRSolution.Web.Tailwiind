import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSettings } from '@/_metronic/providers/SettingsProvider';
import { AppRouting } from '@/app/routing';
import { PathnameProvider } from '@/_metronic/providers';
import { Toaster } from '@/_metronic/components/ui/sonner';
const {
  BASE_URL
} = import.meta.env;
const App = () => {
  const {
    settings
  } = useSettings();
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add(settings.themeMode);
  }, [settings]);
  return <BrowserRouter basename={BASE_URL} future={{
    v7_relativeSplatPath: true,
    v7_startTransition: true
  }}>
      <PathnameProvider>
        <AppRouting />
      </PathnameProvider>
      <Toaster />
    </BrowserRouter>;
};
export { App };