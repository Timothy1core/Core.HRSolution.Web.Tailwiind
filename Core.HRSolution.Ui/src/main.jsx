import '@/_metronic/components/keenicons/assets/styles.css';
import './_metronic/styles/globals.css';
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import {AuthProvider, setupAxios} from './app/modules/auth'
import { ProvidersWrapper } from './_metronic/providers';
import React from 'react';
import {AuthInit} from '@/app/modules/auth';
import { LoadingProvider } from './app/helpers/loading/loading_provider';
/**
 * Inject interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
setupAxios(axios);
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AuthInit>
        <ProvidersWrapper>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </ProvidersWrapper>
      </AuthInit>
    </AuthProvider>
  </React.StrictMode>
)