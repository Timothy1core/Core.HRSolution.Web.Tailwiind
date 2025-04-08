import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '@/app/auth/providers/JWTProvider';
import { LayoutProvider, LoadersProvider, MenusProvider, SettingsProvider } from '@/_metronic/providers';
import { HelmetProvider } from 'react-helmet-async';
const queryClient = new QueryClient();
const ProvidersWrapper = ({
  children
}) => {
  return <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
            <HelmetProvider>
              <LayoutProvider>
                <LoadersProvider>
                  <MenusProvider>{children}</MenusProvider>
                </LoadersProvider>
              </LayoutProvider>
            </HelmetProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>;
};
export { ProvidersWrapper };